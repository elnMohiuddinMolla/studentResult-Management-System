// Elements
const tabAdminBtn = document.getElementById("tabAdminBtn");
const tabStudentBtn = document.getElementById("tabStudentBtn");
const adminLoginPanel = document.getElementById("adminLoginPanel");
const adminPanel = document.getElementById("adminPanel");
const studentPanel = document.getElementById("studentPanel");
const logoutBtn = document.getElementById("logoutBtn");

const adminLoginForm = document.getElementById("adminLoginForm");
const adminForm = document.getElementById("adminForm");
const adminHistory = document.getElementById("adminHistory");

const studentForm = document.getElementById("studentForm");
const studentResult = document.getElementById("studentResult");

// Hardcoded admin credentials
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "1234";

// Load results from localStorage
let students = JSON.parse(localStorage.getItem("results")) || [];

// ===== TAB SWITCHING =====
tabAdminBtn.addEventListener("click", e => {
  e.preventDefault();
  tabAdminBtn.classList.add("active-tab");
  tabStudentBtn.classList.remove("active-tab");
  if (sessionStorage.getItem("adminLoggedIn") === "true") {
    adminPanel.style.display = "block";
    adminLoginPanel.style.display = "none";
  } else {
    adminLoginPanel.style.display = "block";
    adminPanel.style.display = "none";
  }
  studentPanel.style.display = "none";
  clearStudentResult();
});

tabStudentBtn.addEventListener("click", e => {
  e.preventDefault();
  tabStudentBtn.classList.add("active-tab");
  tabAdminBtn.classList.remove("active-tab");
  adminPanel.style.display = "none";
  adminLoginPanel.style.display = "none";
  studentPanel.style.display = "block";
});

// ===== ADMIN LOGIN =====
adminLoginForm.addEventListener("submit", e => {
  e.preventDefault();
  const username = document.getElementById("adminUsername").value.trim();
  const password = document.getElementById("adminPassword").value;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    alert("Login successful!");
    sessionStorage.setItem("adminLoggedIn", "true");
    adminLoginPanel.style.display = "none";
    adminPanel.style.display = "block";
    renderAdminHistory();
  } else {
    alert("Invalid username or password!");
  }

  adminLoginForm.reset();
});

// ===== LOGOUT =====
logoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem("adminLoggedIn");
  adminPanel.style.display = "none";
  adminLoginPanel.style.display = "block";
});

// ===== ADMIN: Add/Update Result =====
adminForm.addEventListener("submit", e => {
  e.preventDefault();
  const roll = document.getElementById("rollAdmin").value.trim();
  const name = document.getElementById("nameAdmin").value.trim();
  const dsa = Number(document.getElementById("dsa").value);
  const oop = Number(document.getElementById("oop").value);
  const eee = Number(document.getElementById("eee").value);
  const pulse = Number(document.getElementById("pulse").value);

  if (!roll || !name || [dsa, oop, eee, pulse].some(m => isNaN(m) || m < 0 || m > 100)) {
    alert("Enter valid details (Marks 0–100)");
    return;
  }

  const subjects = { dsa, oop, eee, pulse };
  const cgpa = calculateCGPA(subjects);
  const status = cgpa >= 2.0 ? "PASS" : "FAIL"; // pass if CGPA >= 2.0

  const existingIndex = students.findIndex(s => s.roll === roll);
  if (existingIndex >= 0) {
    students[existingIndex] = { roll, name, subjects, cgpa, status };
  } else {
    students.push({ roll, name, subjects, cgpa, status });
  }

  saveAndRender();
  adminForm.reset();
});

// ===== ADMIN: Delete student =====
adminHistory.addEventListener("click", e => {
  if (e.target.classList.contains("delete-btn")) {
    const rollToDelete = e.target.dataset.roll;
    if (confirm(`Delete student with roll number ${rollToDelete}?`)) {
      students = students.filter(s => s.roll !== rollToDelete);
      saveAndRender();
    }
  }
});

// ===== STUDENT: Search Result =====
studentForm.addEventListener("submit", e => {
  e.preventDefault();
  const roll = document.getElementById("rollStudent").value.trim();
  if (!roll) {
    showStudentResult("Please enter a roll number.", false);
    return;
  }
  const student = students.find(s => s.roll === roll);
  if (!student) {
    showStudentResult(`No result found for roll number: ${roll}`, false);
    return;
  }
  const { subjects, cgpa, status, name } = student;
  showStudentResult(`
    <strong>${name}</strong><br>
    Roll: ${roll}<br>
    DSA: ${subjects.dsa} | OOP: ${subjects.oop} | EEE: ${subjects.eee} | PULSE: ${subjects.pulse}<br>
    CGPA: ${cgpa.toFixed(2)}<br>
    Status: <span class="${status === "PASS" ? "pass" : "fail"}">${status}</span>
  `, status === "PASS");
});

// ===== HELPERS =====
function calculateGradePoint(marks) {
  if (marks >= 80) return 4.0;
  if (marks >= 70) return 3.5;
  if (marks >= 60) return 3.0;
  if (marks >= 50) return 2.5;
  if (marks >= 40) return 2.0;
  return 0.0;
}

function calculateCGPA(subjects) {
  const total = Object.values(subjects).reduce((sum, marks) => sum + calculateGradePoint(marks), 0);
  return total / Object.keys(subjects).length;
}

function saveAndRender() {
  localStorage.setItem("results", JSON.stringify(students));
  renderAdminHistory();
  clearStudentResult();
}

function renderAdminHistory() {
  adminHistory.innerHTML = "";
  students.forEach(({ roll, name, subjects, cgpa, status }) => {
    adminHistory.innerHTML += `
      <tr>
        <td>${roll}</td>
        <td>${name}</td>
        <td>${subjects.dsa}</td>
        <td>${subjects.oop}</td>
        <td>${subjects.eee}</td>
        <td>${subjects.pulse}</td>
        <td>${cgpa.toFixed(2)}</td>
        <td class="${status === "PASS" ? "pass" : "fail"}">${status}</td>
        <td><button class="delete-btn" data-roll="${roll}">Delete</button></td>
      </tr>
    `;
  });
}

function showStudentResult(html, isPass) {
  studentResult.innerHTML = html;
  studentResult.className = `result-box show ${isPass ? "pass" : "fail"}`;
}

function clearStudentResult() {
  studentResult.innerHTML = "";
  studentResult.className = "result-box";
}

// Initial render if already logged in
if (sessionStorage.getItem("adminLoggedIn") === "true") {
  adminLoginPanel.style.display = "none";
  adminPanel.style.display = "block";
  renderAdminHistory();
}
