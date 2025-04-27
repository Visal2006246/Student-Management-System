document.getElementById("studentForm").addEventListener("submit", addOrUpdateStudent);
fetchStudents();

let editingStudentId = null;

function fetchStudents() {
  fetch('http://localhost:5000/api/students')
    .then(res => res.json())
    .then(data => {
      const studentsTable = document.querySelector("#studentsTable tbody");
      studentsTable.innerHTML = ""; 

      data.forEach(student => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${student.name}</td>
          <td>${student.email}</td>
          <td>${student.age}</td>
          <td>${student.enrolledCourses.map(course => course.courseName).join(", ")}</td>
          <td>
            <button class="btn btn-warning" onclick="editStudent('${student._id}')">Edit</button>
            <button class="btn btn-danger" onclick="deleteStudent('${student._id}')">Delete</button>
          </td>
        `;
        studentsTable.appendChild(row);
      });
    })
    .catch(err => console.log("Error:", err));
}

function addOrUpdateStudent(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const age = document.getElementById("age").value;
  const courses = document.getElementById("courses").value.split(",").map(course => course.trim());

  if (editingStudentId) {
    // We are editing an existing student (send PUT request)
    fetch(`http://localhost:5000/api/students/${editingStudentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        age,
        enrolledCourses: courses
      })
    })
      .then(response => response.json())
      .then(() => {
        resetForm();
        fetchStudents();
        editingStudentId = null;
      })
      .catch(err => console.log("Error:", err));

  } else {
    fetch('http://localhost:5000/api/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        age,
        enrolledCourses: courses
      })
    })
      .then(response => response.json())
      .then(() => {
        resetForm();
        fetchStudents();
      })
      .catch(err => console.log("Error:", err));
  }
}

function editStudent(studentId) {
  fetch(`http://localhost:5000/api/students/${studentId}`)
    .then(res => res.json())
    .then(student => {
      document.getElementById("name").value = student.name;
      document.getElementById("email").value = student.email;
      document.getElementById("age").value = student.age;
      document.getElementById("courses").value = student.enrolledCourses.map(course => course.courseName).join(", ");

      editingStudentId = studentId;

      document.querySelector("button[type='submit']").textContent = "Update Student";
    })
    .catch(err => console.log("Error:", err));
}

function resetForm() {
  document.getElementById("name").value = '';
  document.getElementById("email").value = '';
  document.getElementById("age").value = '';
  document.getElementById("courses").value = '';
  document.querySelector("button[type='submit']").textContent = "Add Student";
}

function deleteStudent(studentId) {
  const confirmed = confirm("Are you sure you want to delete this student?");
  if (confirmed) {
    fetch(`http://localhost:5000/api/students/${studentId}`, {
      method: 'DELETE'
    })
      .then(() => fetchStudents())
      .catch(err => console.log("Error:", err));
  }
}
