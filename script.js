const form = document.getElementById("studentForm");
const tableBody = document.getElementById("studentTableBody");
const searchInput = document.getElementById("searchInput");
const filterCourse = document.getElementById("filterCourse");

let students = JSON.parse(localStorage.getItem("students")) || [];

// Initial load
displayStudents();
updateStats();

// Add or Update Student
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const id = document.getElementById("studentId").value;
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const course = document.getElementById("course").value;

    if (!name || !email || !course) {
        alert("Please fill all fields.");
        return;
    }

    const student = {
        id: id || Date.now().toString(),
        name,
        email,
        course
    };

    if (id) {
        const index = students.findIndex(item => item.id === id);

        if (index !== -1) {
            students[index] = student;
        }
    } else {
        students.push(student);
    }

    saveStudents();

    form.reset();
    document.getElementById("studentId").value = "";

    displayStudents();
    updateStats();
});

// Display Students
function displayStudents() {
    const searchText = searchInput.value.toLowerCase();
    const selectedCourse = filterCourse.value;

    const filteredStudents = students.filter(student => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchText) ||
            student.email.toLowerCase().includes(searchText) ||
            student.course.toLowerCase().includes(searchText);

        const matchesCourse =
            selectedCourse === "all" ||
            student.course === selectedCourse;

        return matchesSearch && matchesCourse;
    });

    tableBody.innerHTML = "";

    if (filteredStudents.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-message">
                    No students found
                </td>
            </tr>
        `;
        return;
    }

    filteredStudents.forEach(student => {
        tableBody.innerHTML += `
            <tr>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.course}</td>
                <td>
                    <button
                        class="action-btn edit-btn"
                        onclick="editStudent('${student.id}')">
                        Edit
                    </button>

                    <button
                        class="action-btn delete-btn"
                        onclick="deleteStudent('${student.id}')">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

// Edit Student
function editStudent(id) {
    const student = students.find(item => item.id === id);

    if (!student) return;

    document.getElementById("studentId").value = student.id;
    document.getElementById("name").value = student.name;
    document.getElementById("email").value = student.email;
    document.getElementById("course").value = student.course;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Delete Student
function deleteStudent(id) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    students = students.filter(item => item.id !== id);

    saveStudents();
    displayStudents();
    updateStats();
}

// Save to localStorage
function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

// Update Quick Stats
function updateStats() {
    document.getElementById("totalStudents").textContent = students.length;

    document.getElementById("cseCount").textContent =
        students.filter(student => student.course === "CSE").length;

    document.getElementById("eceCount").textContent =
        students.filter(student => student.course === "ECE").length;

    document.getElementById("eeeCount").textContent =
        students.filter(student => student.course === "EEE").length;

    document.getElementById("mechCount").textContent =
        students.filter(student => student.course === "MECH").length;
}

// Search and Filter Events
searchInput.addEventListener("input", displayStudents);
filterCourse.addEventListener("change", displayStudents);