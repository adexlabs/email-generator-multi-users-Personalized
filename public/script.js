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

    users.forEach((user, index) => {

        box.innerHTML += `
        <div class="user-item">
            <label>
                <input class="user-checkbox" type="checkbox" data-name="${user.name}" data-email="${user.email}">
                ${user.name}
                (${user.email})
            </label>
        </div>
        `;
    });
}

// async function sendEmail() {

//     const selectedUsers = [];

//     document
//         .querySelectorAll("#users input:checked")
//         .forEach(cb => {
//             selectedUsers.push(users[cb.value]);
//         });

//     if (selectedUsers.length === 0) {
//         alert("Select at least one customer");
//         return;
//     }

//     document.getElementById("loader").style.display = "block";
//     document.getElementById("sendBtn").disabled = true;

//     const response =
//         await fetch("/send-email", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 users: selectedUsers,
//                 product:
//                     document.getElementById("product").value,
//                 discount:
//                     document.getElementById("discount").value
//             })
//         });

//     const data = await response.json();

//     document.getElementById("loader").style.display = "none";
//     document.getElementById("sendBtn").disabled = false;

//     document.getElementById("msg").innerText =
//         data.message ||
//         data.error ||
//         "Something went wrong";
// }


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

    console.log(selectedUsers);

    if (selectedUsers.length === 0) {
        alert("Select at least one user");
        return;
    }

    const loader =
        document.getElementById("loader");

    const sendBtn =
        document.getElementById("sendBtn");

    try {

        loader.style.display = "block";
        sendBtn.disabled = true;

        const response = await fetch(
            "/send-email",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
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

        const data =
            await response.json();

        alert(data.message);

    } catch (error) {

        console.log(error);
        alert("Error sending emails");

    } finally {

        loader.style.display = "none";
        sendBtn.disabled = false;
    }
}