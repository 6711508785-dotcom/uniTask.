import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, query, orderBy } 
       from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAtngyrbT-xuq1nQvLXE9J8ntMuxCW5bsk",
    authDomain: "unitask-31951.firebaseapp.com",
    projectId: "unitask-31951",
    storageBucket: "unitask-31951.firebasestorage.app",
    messagingSenderId: "1036156264167",
    appId: "1:1036156264167:web:fa2e929ff5a5bf002a8c42"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const tasksCol = collection(db, "assignments");

const colors = ['#fbcfe8', '#e9d5ff', '#a5f3fc', '#bae6fd', '#fed7aa'];

window.addTask = async () => {
    const subject = document.getElementById('subjectName').value;
    const title = document.getElementById('taskName').value;
    const date = document.getElementById('dueDate').value;
    const category = document.querySelector('input[name="category"]:checked').value;

    if (subject && title && date) {
        await addDoc(tasksCol, {
            subject, title, deadline: date, category,
            isDone: false,
            color: colors[Math.floor(Math.random() * colors.length)],
            createdAt: new Date()
        });
        document.getElementById('taskName').value = '';
    } else {
        alert("กรอกข้อมูลให้ครบก่อนน้า");
    }
};

window.toggleDone = async (id, status) => {
    await updateDoc(doc(db, "assignments", id), { isDone: !status });
};

window.deleteTask = async (id) => {
    if(confirm("ลบงานนี้ใช่ไหม?")) await deleteDoc(doc(db, "assignments", id));
};

onSnapshot(query(tasksCol, orderBy("deadline", "asc")), (snapshot) => {
    const taskList = document.getElementById('taskList');
    let total = 0, pending = 0;
    taskList.innerHTML = '';

    snapshot.forEach((doc) => {
        const data = doc.data();
        const id = doc.id;
        total++; if(!data.isDone) pending++;

        const item = document.createElement('div');
        item.className = `task-item ${data.isDone ? 'done' : ''}`;
        item.style.setProperty('--accent-color', data.color);
        item.innerHTML = `
            <button class="check-btn" onclick="toggleDone('${id}', ${data.isDone})">${data.isDone ? '✓' : ''}</button>
            <div style="flex:1">
                <span class="subject-tag">${data.category} | ${data.subject}</span>
                <h3 style="margin:5px 0">${data.title}</h3>
                <small>📅 ส่งภายใน: ${data.deadline}</small>
            </div>
            <button class="btn-delete" onclick="deleteTask('${id}')">🗑️</button>
        `;
        taskList.appendChild(item);
    });
    document.getElementById('totalTasks').innerText = total;
    document.getElementById('pendingTasks').innerText = pending;
});
