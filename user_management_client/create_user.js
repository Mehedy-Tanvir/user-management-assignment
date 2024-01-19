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
        } else {
          console.error(result.message);
        }
      })
      .catch((error) => {
        console.error("Error creating user:", error);
      });
  });
});
