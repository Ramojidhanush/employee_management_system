// ✅ UPDATED script.js with authentication control (frontend)
document.addEventListener("DOMContentLoaded", () => {
  const employeeForm = document.getElementById("employeeForm");
  const employeeList = document.getElementById("employeeList");

  const baseURL = "https://employee-management-system-2-cis4.onrender.com";

  // 🔐 Admin Key (you can change this to anything secure)
  const ADMIN_KEY = "admin123";

  // Load all employees
  function loadEmployees() {
    fetch(`${baseURL}/employees`)
      .then(res => res.json())
      .then(data => {
        employeeList.innerHTML = "";
        data.forEach(employee => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${employee.name}</td>
            <td>${employee.role}</td>
            <td>${employee.department}</td>
            <td>${employee.salary}</td>
            <td>
              <button class="deleteBtn" data-id="${employee.id}">Delete</button>
            </td>
          `;
          employeeList.appendChild(row);
        });

        // Hide delete buttons by default
        document.querySelectorAll(".deleteBtn").forEach(button => {
          button.style.display = "none";
        });
      })
      .catch(err => console.error("Error loading employees:", err));
  }

  // Delete an employee
  function deleteEmployee(id) {
    fetch(`${baseURL}/employees/${id}`, {
      method: "DELETE"
    })
      .then(() => loadEmployees())
      .catch(err => console.error("Error deleting employee:", err));
  }

  // Add new employee
  employeeForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const role = document.getElementById("role").value.trim();
    const department = document.getElementById("department").value.trim();
    const salary = parseFloat(document.getElementById("salary").value);

    if (!name || !role || !department || isNaN(salary)) {
      alert("Please fill all fields correctly.");
      return;
    }

    const employee = { name, role, department, salary };

    fetch(`${baseURL}/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee)
    })
      .then(() => {
        employeeForm.reset();
        loadEmployees();
      })
      .catch(err => console.error("Error adding employee:", err));
  });

  // ✅ Prompt for admin access
  const isAdmin = prompt("Enter admin key to manage employees:") === ADMIN_KEY;

  if (isAdmin) {
    // If admin, re-show delete buttons
    setTimeout(() => {
      document.querySelectorAll(".deleteBtn").forEach(button => {
        button.style.display = "inline-block";
        button.addEventListener("click", () => {
          const id = button.getAttribute("data-id");
          const confirmDelete = confirm("Are you sure you want to delete this employee?");
          if (confirmDelete) {
            deleteEmployee(id);
          }
        });
      });
    }, 1000); // Delay to allow DOM to update
  }

  // Initial load
  loadEmployees();
});
