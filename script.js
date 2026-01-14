// ---------------------
// Global constants
// ---------------------
const API_URL = "http://localhost:3000"; // server.js endpoint

// ---------------------
// Login & Register
// ---------------------
async function registerUser() {
  const fullName = document.getElementById("fullName").value.trim();
  const userID = document.getElementById("userID").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  if (!fullName || !userID || !email || !password || !role) {
    alert("⚠️ Please fill all fields.");
    return;
  }

  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify({ fullName, userID, email, password, role })
  });
  const data = await res.json();
  if(data.success) alert("✅ Registration successful. Please login."); 
  else alert(`⚠️ ${data.message}`);
}

async function loginUser() {
  const userID = document.getElementById("userID").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value.trim().toLowerCase(); // <-- normalize

  if (!userID || !password || !role) {
    alert("⚠️ Please fill all fields.");
    return;
  }

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify({ userID, password, role })
  });
  const data = await res.json();
  if (data.success) {
    localStorage.setItem("loggedUser", JSON.stringify(data.user));
    if(role === "student") window.location.href="dashboard.html";
    else if(role === "counselor") window.location.href="counselor.html";
    else if(role === "admin") window.location.href="admin.html";
  } else alert(`⚠️ ${data.message}`);
}

// ---------------------
// Student Dashboard Functions
// ---------------------

// Mood
async function recordMood() {
  const mood = document.getElementById("mood").value;
  const notes = document.getElementById("notes").value;

  if (!mood) {
    alert("⚠️ Please select a mood.");
    return;
  }

  const user = JSON.parse(localStorage.getItem("loggedUser"));

  const res = await fetch(`${API_URL}/moods`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      studentID: user.userID,
      mood: mood,
      message: notes
    })
  });

  const data = await res.json();
  if (data.success) {
    alert("✅ Mood recorded.");
    document.getElementById("notes").value = "";
	loadMoodHistory();
  }
}

async function loadMoodHistory() {
  const table = document.getElementById("moodHistory");
  if (!table) return;

  table.innerHTML = `
    <tr>
      <th>Date</th>
      <th>Mood</th>
      <th>Notes</th>
    </tr>`;

  const user = JSON.parse(localStorage.getItem("loggedUser"));
  try {
    const res = await fetch(`${API_URL}/moods/${user.userID}`);
    const data = await res.json();

    data.forEach(m => {
      let row = table.insertRow();
      row.insertCell(0).innerText =
        m.created_at ? new Date(m.created_at).toLocaleString() : "-";
      row.insertCell(1).innerText = m.mood;
      row.insertCell(2).innerText = m.message;
    });

  } catch (err) {
    console.error("Failed to load mood history:", err);
  }
}

// BMI
async function recordBMI() {
  const weight = parseFloat(document.getElementById("weight").value);
  const height = parseFloat(document.getElementById("height").value);
  if (!weight || !height) return alert("⚠️ Please enter weight and height.");

  const bmiValue = (weight / ((height/100)**2)).toFixed(2);
  let status = "";
  if(bmiValue < 18.5) status="Underweight";
  else if(bmiValue < 25) status="Normal";
  else if(bmiValue < 30) status="Overweight";
  else status="Obese";

  const user = JSON.parse(localStorage.getItem("loggedUser"));

  const res = await fetch(`${API_URL}/bmi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      studentID: user.userID,
      value: bmiValue,
      status: status,
      weight: weight,
      height: height
    })
  });

  const data = await res.json();
  if(data.success){
    alert("✅ BMI recorded.");
    loadBMIHistory();
    document.getElementById("weight").value="";
    document.getElementById("height").value="";
  }
}

async function loadBMIHistory() {
  const table = document.getElementById("bmiHistory");
  if (!table) return;

  table.innerHTML = `
    <tr>
      <th>Date</th>
      <th>Weight (kg)</th>
      <th>Height (cm)</th>
      <th>BMI</th>
      <th>Status</th>
    </tr>
  `;

  const user = JSON.parse(localStorage.getItem("loggedUser"));

  try {
    const res = await fetch(`${API_URL}/bmi/${user.userID}`);
    const data = await res.json();

    data.forEach(b => {
		let row = table.insertRow();
		row.insertCell(0).innerText = b.created_at ? new Date(b.created_at).toLocaleString() : "-";
		row.insertCell(1).innerText = b.weight;
		row.insertCell(2).innerText = b.height;
		row.insertCell(3).innerText = b.value;
		row.insertCell(4).innerText = b.status;
    });


  } catch (err) {
    console.error("Failed to load BMI history:", err);
  }
}

// Timetable
async function addTimetable() {
  const day = document.getElementById("day").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const time = document.getElementById("time").value.trim();
  if(!day || !subject || !time) return alert("⚠️ Fill all fields.");

  const user = JSON.parse(localStorage.getItem("loggedUser"));

  await fetch(`${API_URL}/timetable`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ studentID: user.userID, day, subject, time }) // note: studentID
  });

  alert("✅ Timetable added.");
  loadTimetable();
  document.getElementById("day").value="";
  document.getElementById("subject").value="";
  document.getElementById("time").value="";
}

async function loadTimetable() {
  const table = document.getElementById("timetableTable");
  if(!table) return;

  table.innerHTML = `<tr><th>Day</th><th>Subject</th><th>Time</th><th>Action</th></tr>`;

  const user = JSON.parse(localStorage.getItem("loggedUser"));

  const res = await fetch(`${API_URL}/timetable/${user.userID}`);
  const data = await res.json();

  data.forEach((t) => {
    let row = table.insertRow();
    row.insertCell(0).innerText = t.day;
    row.insertCell(1).innerText = t.subject;
    row.insertCell(2).innerText = t.time;
    row.insertCell(3).innerHTML = `<button onclick="deleteTimetable(${t.id})">❌ Delete</button>`;
  });
}

async function deleteTimetable(id) {
  await fetch(`${API_URL}/timetable/${id}`, { method: "DELETE" });
  alert("✅ Timetable deleted.");
  loadTimetable();
}

async function resetTimetable() {
  const user = JSON.parse(localStorage.getItem("loggedUser"));

  const res = await fetch(`${API_URL}/timetable/reset/${user.userID}`, { method: "DELETE" });

  if(res.ok) {
    alert("✅ Timetable reset.");
    loadTimetable();
  } else {
    alert("⚠️ Failed to reset timetable.");
  }
}

// ---------------------
// Counselor Functions
// ---------------------
// 1️⃣ Load all students BMI for counselor
async function loadCounselorBMI() {
  const table = document.getElementById("bmiTable");
  if (!table) return;

  table.innerHTML = `
    <tr>
      <th>Student ID</th>
      <th>Student Name</th>
      <th>Latest BMI (Value / Status)</th>
      <th>Action</th>
    </tr>
  `;

  try {
    const res = await fetch(`${API_URL}/counselor/bmi`);
    const data = await res.json();

    if (!data.length) {
      const row = table.insertRow();
      row.insertCell(0).innerText = "-";
      row.insertCell(1).innerText = "No students found";
      row.insertCell(2).innerText = "-";
      row.insertCell(3).innerText = "-";
      return;
    }

    data.forEach(student => {
      const row = table.insertRow();
      row.insertCell(0).innerText = student.userID;
      row.insertCell(1).innerText = student.fullName;
      row.insertCell(2).innerText = student.bmi ? `${student.bmi} (${student.status})` : "No record";
      const actionCell = row.insertCell(3);
      const btn = document.createElement("button");
      btn.innerText = "View";
      btn.onclick = () => {
        window.location.href = `student_bmi_details.html?id=${student.userID}`;
      };
      actionCell.appendChild(btn);
    });

  } catch (err) {
    console.error(err);
    alert("⚠️ Failed to load students BMI.");
  }
}

// 2️⃣ Load a specific student BMI details
async function loadStudentBMIDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const studentID = urlParams.get("id");
  if (!studentID) return;

  const table = document.getElementById("bmiDetailsTable");
  table.innerHTML = `<tr><th>Date</th><th>BMI Value</th><th>Status</th></tr>`;

  try {
    // Get student info
    const resUser = await fetch(`${API_URL}/users/${studentID}`);
    const user = await resUser.json();
    document.getElementById("studentName").innerText = `Student: ${user.fullName} (${studentID})`;

    // Get BMI records
    const resBMI = await fetch(`${API_URL}/bmi/${studentID}`);
    const bmiRecords = await resBMI.json();

    if (!bmiRecords.length) {
      const row = table.insertRow();
      row.insertCell(0).innerText = "-";
      row.insertCell(1).innerText = "-";
      row.insertCell(2).innerText = "No records";
      return;
    }

    bmiRecords.forEach(b => {
      const row = table.insertRow();
      row.insertCell(0).innerText = new Date(b.created_at).toLocaleString();
      row.insertCell(1).innerText = b.value;
      row.insertCell(2).innerText = b.status;
    });

  } catch (err) {
    console.error(err);
    alert("⚠️ Failed to load BMI details.");
  }
}

// 3️⃣ Load all students with mood records
async function loadCounselorMood() {
  const table = document.getElementById("studentsTable");
  if (!table) return;

  table.innerHTML = `<tr>
      <th>Student ID</th>
      <th>Student Name</th>
      <th>Action</th>
    </tr>`;

  try {
    const res = await fetch(`${API_URL}/counselor/mood`);
    const students = await res.json();

    if (!students.length) {
      const row = table.insertRow();
      row.insertCell(0).innerText = "-";
      row.insertCell(1).innerText = "No students found";
      row.insertCell(2).innerText = "-";
      return;
    }

    students.forEach(student => {
      const row = table.insertRow();
      row.insertCell(0).innerText = student.userID;
      row.insertCell(1).innerText = student.fullName;
      const actionCell = row.insertCell(2);
      const btn = document.createElement("button");
      btn.innerText = "View Records 📋";
      btn.onclick = () => {
        window.location.href = `student_mood_details.html?id=${student.userID}`;
      };
      actionCell.appendChild(btn);
    });

  } catch (err) {
    console.error(err);
    alert("⚠️ Failed to load students mood records.");
  }
}

// 4️⃣ Load a specific student mood details
async function loadStudentMoodDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const studentID = urlParams.get("id");
  if (!studentID) return;

  const table = document.getElementById("moodDetailsTable");
  table.innerHTML = `<tr><th>Date</th><th>Mood</th><th>Notes</th></tr>`;

  try {
    // Get student info
    const resUser = await fetch(`${API_URL}/users/${studentID}`);
    const user = await resUser.json();
    document.getElementById("studentName").innerText = `Student: ${user.fullName} (${studentID})`;

    // Get mood records
    const resMood = await fetch(`${API_URL}/counselor/mood/${studentID}`);
    const moods = await resMood.json();

    if (!moods.length) {
      const row = table.insertRow();
      row.insertCell(0).innerText = "-";
      row.insertCell(1).innerText = "-";
      row.insertCell(2).innerText = "No records";
      return;
    }

    moods.forEach(m => {
      const row = table.insertRow();
      row.insertCell(0).innerText = new Date(m.date).toLocaleString();
      row.insertCell(1).innerText = m.mood;
      row.insertCell(2).innerText = m.notes || "-";
    });

  } catch (err) {
    console.error(err);
    alert("⚠️ Failed to load student mood details.");
  }
}

// 5️⃣ Send feedback to student
async function sendFeedback() {
  const text = document.getElementById("feedbackText").value.trim();
  if (!text) return alert("⚠️ Enter feedback.");

  const urlParams = new URLSearchParams(window.location.search);
  const studentID = urlParams.get("id");
  const counselor = JSON.parse(localStorage.getItem("loggedUser")); // counselor must be logged in

  try {
    const res = await fetch(`${API_URL}/counselor/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentID, counselorID: counselor.userID, text })
    });
    const data = await res.json();

    if (data.success) {
      document.getElementById("feedbackMsg").innerText = "✅ Feedback sent!";
      document.getElementById("feedbackText").value = "";
    } else {
      alert(`⚠️ ${data.message}`);
    }
  } catch (err) {
    console.error(err);
    alert("⚠️ Failed to send feedback.");
  }
}
// ---------------------
// Student Feedback
// ---------------------
async function loadFeedback() {
  try {
    const user = JSON.parse(localStorage.getItem("loggedUser"));
    const res = await fetch(`${API_URL}/feedback/${user.userID}`);
    const data = await res.json();

    const container = document.getElementById("feedbackList");
    if (data.length === 0) {
      container.innerHTML = "No feedback yet.";
      return;
    }

    container.innerHTML = "";
    data.forEach(fb => {
      const div = document.createElement("div");
      div.style.border = "1px solid #ccc";
      div.style.margin = "5px auto";
      div.style.padding = "10px";
      div.style.borderRadius = "8px";
      div.style.maxWidth = "500px";
      div.innerHTML = `
        <strong>Feedback:</strong> ${fb.text} <br>
        <em>${new Date(fb.date).toLocaleString()}</em>
      `;
      container.appendChild(div);
    });

  } catch (err) {
    console.error("Failed to load feedback:", err);
    alert("⚠️ Could not fetch feedback. Check console.");
  }
}

// ---------------------
// Admin Functions
// ---------------------
// Load all users for admin (students & counselors)
async function loadUsersForAdmin() {
  const table = document.getElementById("studentTable");
  if (!table) return;

  try {
    const res = await fetch(`${API_URL}/admin/users`);
    const users = await res.json();

    table.innerHTML = `
      <tr>
        <th>Full Name</th>
        <th>ID</th>
        <th>Email</th>
        <th>Role</th>
        <th>View</th>
        <th>Delete</th>
      </tr>`;

    users.forEach(u => {
      const row = table.insertRow();
      row.insertCell(0).innerText = u.fullName;
      row.insertCell(1).innerText = u.userID;
      row.insertCell(2).innerText = u.email;
      row.insertCell(3).innerText = u.role;
      row.insertCell(4).innerHTML = `<button onclick="viewAdminStudent('${u.userID}')">View</button>`;
      row.insertCell(5).innerHTML = `<button class="delete-btn" onclick="deleteAdminStudent('${u.userID}')">Delete</button>`;
    });
  } catch (err) {
    console.error(err);
    alert("⚠️ Failed to load users.");
  }
}

// Add new user (student or counselor)
async function addStudent() {
  const fullName = document.getElementById("fullName").value.trim();
  const userID = document.getElementById("userID").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = "student";

  if (!fullName || !userID || !email || !password) {
    alert("⚠️ Please fill all fields.");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/admin/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, userID, email, password, role })
    });
    const data = await res.json();
    if (data.success) {
      alert("✅ User added successfully.");
      loadUsersForAdmin();
      document.getElementById("fullName").value = "";
      document.getElementById("userID").value = "";
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
    } else {
      alert(`⚠️ ${data.message}`);
    }
  } catch (err) {
    console.error(err);
    alert("⚠️ Failed to add user.");
  }
}

// Delete user
async function deleteAdminStudent(userID) {
  if (!confirm("Delete this user AND all records?")) return;

  try {
    const res = await fetch(`${API_URL}/admin/users/${userID}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      alert("✅ User deleted.");
      loadUsersForAdmin();
    } else {
      alert(`⚠️ ${data.message}`);
    }
  } catch (err) {
    console.error(err);
    alert("⚠️ Failed to delete user.");
  }
}

// View user (redirect to details page)
function viewAdminStudent(userID) {
  window.location.href = `student_details.html?id=${userID}`;
}
// ---------------------
// Wellness Tip (OpenAI)
// ---------------------
async function getWellnessTipButton() {
  console.log("🟢 Wellness tip button clicked");

  const tipBox = document.getElementById("wellnessTip");
  tipBox.innerText = "⏳ Getting your wellness tip...";

  try {
    const user = JSON.parse(localStorage.getItem("loggedUser"));
    if (!user || !user.userID) {
      tipBox.innerText = "⚠️ Session expired. Please login again.";
      return;
    }

    // ---------- Get LATEST mood ----------
    const moodRes = await fetch(`${API_URL}/moods/${user.userID}`);
    if (!moodRes.ok) throw new Error("Mood fetch failed");
    const moods = await moodRes.json();

    const latestMood =
      moods.length > 0 && moods[0].mood
        ? moods[0].mood
        : "Neutral";

    // ---------- Get LATEST BMI ----------
    const bmiRes = await fetch(`${API_URL}/bmi/${user.userID}`);
    if (!bmiRes.ok) throw new Error("BMI fetch failed");
    const bmis = await bmiRes.json();

    const latestBMI =
      bmis.length > 0 && bmis[0].status
        ? bmis[0].status
        : "Normal";

    // ---------- Get timetable summary ----------
    const ttRes = await fetch(`${API_URL}/timetable/${user.userID}`);
    if (!ttRes.ok) throw new Error("Timetable fetch failed");
    const timetable = await ttRes.json();

    const timetableSummary =
      timetable.length > 0
        ? `${timetable.length} classes scheduled`
        : "No classes scheduled";

    // ---------- Send to OpenAI ----------
    const aiRes = await fetch(`${API_URL}/wellness-tip`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mood: latestMood,
        bmiStatus: latestBMI,
        timetableSummary
      })
    });

    if (!aiRes.ok) throw new Error("OpenAI request failed");

    const aiData = await aiRes.json();

    tipBox.innerText = aiData.tip
      ? `💡 Wellness Tip: ${aiData.tip}`
      : "💡 No wellness tip available.";

  } catch (err) {
    console.error("❌ Wellness Tip Error:", err);
    tipBox.innerText = "⚠️ Unable to generate wellness tip right now.";
  }
}
