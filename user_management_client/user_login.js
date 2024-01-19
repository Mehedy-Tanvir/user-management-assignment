document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.querySelector(".login-button");

  loginButton.addEventListener("click", async function () {
    const userId = document.querySelector('input[placeholder="User Id"]').value;
    const password = document.querySelector(
      'input[placeholder="Password"]'
    ).value;

    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, password: password }),
      });

      if (response.ok) {
        window.location.href = "./user_profile.html";
      } else {
        const data = await response.json();
        console.error("Login failed:", data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  });
});
