let users = [];

function addUser() {

    const name =
        document.getElementById("username").value;

    const email =
        document.getElementById("useremail").value;

    if (!name || !email) {
        alert("Enter name and email");
        return;
    }

    users.push({
        name,
        email
    });

    renderUsers();

    document.getElementById("username").value = "";
    document.getElementById("useremail").value = "";
}

function renderUsers() {

    const box =
        document.getElementById("users");

    box.innerHTML = "";

    users.forEach(user => {

        box.innerHTML += `
      <div>
        <label>
          <input
            class="user-checkbox"
            type="checkbox"
            data-name="${user.name}"
            data-email="${user.email}"
          >
          ${user.name} (${user.email})
        </label>
      </div>
    `;
    });
    console.log("User Applied:", users);
}

async function sendEmail() {

    const selectedUsers = [];

    document
        .querySelectorAll(".user-checkbox:checked")
        .forEach(cb => {
            selectedUsers.push({
                name: cb.dataset.name,
                email: cb.dataset.email
                
            });
        });

    if (selectedUsers.length === 0) {
        alert("Select at least one user");
        return;
    }

    const response = await fetch(
        "/api/send-email",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                users: selectedUsers,
                product:
                    document.getElementById("product").value,
                discount:
                    document.getElementById("discount").value
            })
        }
    );

    const data = await response.json();

    alert(data.message);
}
