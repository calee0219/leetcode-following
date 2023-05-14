
let lc_api = 'https://leetcode-stats-api.herokuapp.com/';

async function set_to_ls(users) {
    var obj = {'lc_users': []};
    obj.lc_users = users;
    //console.log(users);
    chrome.storage.sync.set(obj, function() {
    });
}
async function enter_user(user) {
    await chrome.storage.sync.get('lc_users', (items) => {
        var users = [];
        if (typeof items.lc_users !== 'undefined') {
            users.push(...items.lc_users);
        }
        if (!users.includes(user)) {
            users.push(user);
            set_to_ls(users);
            render_table_row(user);
        }
    });
}

function delete_user(event) {
    var user = event.target.getAttribute('data-field');
    console.log("DELETE: " + user);
    chrome.storage.sync.get('lc_users', (items) => { 
        //var users = items.lc_users.filter(e => e !== user);
        var users = items.lc_users;
        if (users.includes(user)) {
            users = users.filter(e => e !== user);
            set_to_ls(users);
            document.getElementById(user).remove();
        }
    });
}

function render_table_row(user) {
    var table = document.getElementById('tableBody');
    fetch(lc_api + user)
    .then(rsp => rsp.json())
    .then(jsdata => { 
        $(function () {
            row = document.createElement("tr");
            row.setAttribute("id", user);
            c0 = document.createElement("td");
            a = document.createElement("a");
            a.textContent = user;
            a.href = "https://leetcode.com/".concat(user);
            a.target = "_blank";
            c0.appendChild(a);
            row.appendChild(c0);
            c1 = document.createElement("td");
            c1.textContent = jsdata.totalSolved;
            row.appendChild(c1);
            c2 = document.createElement("td");
            c2.textContent = jsdata.hardSolved;
            row.appendChild(c2);
            c3 = document.createElement("td");
            c3.textContent = jsdata.mediumSolved;
            row.appendChild(c3);
            c4 = document.createElement("td");
            c4.textContent = jsdata.easySolved;
            row.appendChild(c4);
            c5 = document.createElement("td");
            let btn = document.createElement("button");
            btn.innerHTML = "Delete";
            btn.classList.add("btn", "btn-danger", "btn-sm", "btn-rounded", "delete-btn");
            btn.setAttribute("data-field", user);
            btn.setAttribute("type", "button");
            btn.onclick = delete_user;
            c5.appendChild(btn);
            row.appendChild(c5);

            table.appendChild(row);
        });
    })
    .catch(err => { throw err; });
}

document.getElementById('add-user-btn').addEventListener('click', (event) => {
    var input = document.getElementById('add-user-input');
    enter_user(input.value);
    input.value = "";
});

$(document).ready(function(){
    chrome.storage.sync.get(['lc_users'], function(items) {
        var users = [];
        if (typeof items.lc_users !== 'undefined') {
            users.push(...items.lc_users);
        }
        for (const user of users) {
            render_table_row(user);
        }
    });
});
