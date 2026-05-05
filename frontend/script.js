document.addEventListener("DOMContentLoaded", () => {
  const signupDiv = document.getElementById("signup");
  const loginDiv = document.getElementById("login");

  document.getElementById("showSignup").onclick = () => {
    loginDiv.style.display = "none";
    signupDiv.style.display = "block";
  };

  document.getElementById("showLogin").onclick = () => {
    signupDiv.style.display = "none";
    loginDiv.style.display = "block";
  };

  // REGISTER
  document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fName: document.getElementById("signup-fname").value,
        lName: document.getElementById("signup-lname").value,
        email: document.getElementById("signup-email").value,
        password: document.getElementById("signup-password").value
      })
    });

    const data = await res.json();
    alert(data.message);
  });

  // LOGIN
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: document.getElementById("login-email").value,
        password: document.getElementById("login-password").value
      })
    });

    const data = await res.json();
    alert(data.message);
  });
});
