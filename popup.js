// popup.js

const lc_api = 'https://leetcode-stats-api.herokuapp.com/';

document.getElementById('add-user-btn').addEventListener('click', () => {
  const input = document.getElementById('add-user-input').value;
  if(input){
    fetch(lc_api + input).then((rsp) => rsp.json())
    .then((jsdata) => {
      if(jsdata.status === "error"){

        throw new Error("Invalid username")
      } else{
        enterUser(input, jsdata);

      }

    }).catch((err)=>{
      window.alert(err.message)
    })
  }else{
    window.alert("Please enter valid username");
  }
  document.getElementById('add-user-input').value = '';
});

function enterUser(user, jsdata) {
  chrome.storage.sync.get('lc_users', ({ lc_users }) => {
    const users = lc_users || [];
    if (!users.includes(user)) {
      users.push(user);
      chrome.storage.sync.set({ lc_users: users });

      createRow(user, jsdata);

      
    }
  });
}

function createRow(user, jsdata){
  const table = document.getElementById('tableBody');
  const row = document.createElement('tr');
        row.setAttribute('id', user);
        
        const c0 = document.createElement('td');
        const a = document.createElement('a');
        a.textContent = user;
        a.href = `https://leetcode.com/${user}`;
        a.target = '_blank';
        c0.appendChild(a);
        row.appendChild(c0);
        
        const c1 = document.createElement('td');
        c1.textContent = jsdata.totalSolved;
        row.appendChild(c1);
        
        const c2 = document.createElement('td');
        c2.textContent = jsdata.hardSolved;
        row.appendChild(c2);
        
        const c3 = document.createElement('td');
        c3.textContent = jsdata.mediumSolved;
        row.appendChild(c3);
        
        const c4 = document.createElement('td');
        c4.textContent = jsdata.easySolved;
        row.appendChild(c4);
        
        const c5 = document.createElement('td');
        const btn = document.createElement('button');
        btn.innerHTML = 'Delete';
        btn.classList.add('btn', 'btn-danger', 'btn-sm', 'btn-rounded', 'delete-btn');
        btn.setAttribute('data-field', user);
        btn.setAttribute('type', 'button');
        btn.onclick = () => delete_user(user);
        c5.appendChild(btn);
        row.appendChild(c5);
        
        table.appendChild(row);
}

function delete_user(user) {
  chrome.storage.sync.get('lc_users', ({ lc_users }) => {
    const users = lc_users || [];
    if (users.includes(user)) {
      const updatedUsers = users.filter((e) => e !== user);
      chrome.storage.sync.set({ lc_users: updatedUsers });
      const elementToRemove = document.getElementById(user);
      if (elementToRemove) {
        elementToRemove.remove();
      }
    }
  });
}

function renderTableRow(user) {
  
  fetch(lc_api + user)
    .then((rsp) => rsp.json())
    .then((jsdata) => {
        createRow(user, jsdata)
      
      })
    .catch((err) => {
      window.alert(err.message);
    });
}


chrome.storage?.sync.get(['lc_users'], ({ lc_users }) => {
  const users = lc_users || [];
  console.log(users)
  if(users.length!==0){
    for (const user of users) {
      renderTableRow(user);
    }

  }
});
