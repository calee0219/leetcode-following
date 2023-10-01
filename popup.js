// popup.js

const lc_api = 'https://leetcode-stats-api.herokuapp.com/';

document.getElementById('add-user-btn').addEventListener('click', () => {
  const input = document.getElementById('add-user-input').value;
  enterUser(input);
  document.getElementById('add-user-input').value = '';
});

function enterUser(user) {
  chrome.storage.sync.get('lc_users', ({ lc_users }) => {
    const users = lc_users || [];
    if (!users.includes(user)) {
      users.push(user);
      chrome.storage.sync.set({ lc_users: users });
      renderTableRow(user);
    }
  });
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
  const table = document.getElementById('tableBody');
  fetch(lc_api + user)
    .then((rsp) => rsp.json())
    .then((jsdata) => {
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
    })
    .catch((err) => {
      throw err;
    });
}


chrome.storage?.sync.get(['lc_users'], ({ lc_users }) => {
  const users = lc_users || [];
  for (const user of users) {
    renderTableRow(user);
  }
});
