document.addEventListener("DOMContentLoaded", function () {
  const submitButton = document.querySelector(".submit-button");

  submitButton.addEventListener("click", function (event) {
    event.preventDefault();

    const userId = document.querySelector("#userId").value;
    const password = document.querySelector("#password").value;

    const data = {
      user_id: userId,
      password: password,
    };

    fetch("http://localhost:3000/createUsers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          console.log("User created successfully");
          fetchAllUsers();
        } else {
          console.error(result.message);
        }
      })
      .catch((error) => {
        console.error("Error creating user:", error);
      });
  });

  function fetchAllUsers() {
    fetch("http://localhost:3000/users")
      .then((response) => response.json())
      .then((users) => {
        const userContainer = document.querySelector(".userid-container");
        userContainer.innerHTML = "";

        for (let i = 0; i < Math.min(2, users.length); i++) {
          const userDiv = document.createElement("div");
          userDiv.classList.add("user-container", "mb-3");
          userDiv.innerHTML = `<div class="user-number">${users[i].user_id}</div>`;
          userContainer.appendChild(userDiv);
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }

  fetchAllUsers();
});
