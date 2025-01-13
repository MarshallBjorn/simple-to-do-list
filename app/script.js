let xmlDoc = null;

document.getElementById("file-input").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const parser = new DOMParser();
            xmlDoc = parser.parseFromString(e.target.result, "text/xml");
            loadTasks();
        };
        reader.readAsText(file);
    }
});

function loadTasks() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = ""; 

    if (!xmlDoc) {
        alert("No XML file loaded! New one has been created");
        initDefXML();
    }

    const tasks = xmlDoc.getElementsByTagName("task");
    for (let task of tasks) {
        const id = task.getAttribute("id");
        const completed = task.getAttribute("completed") === "true";
        const description = task.getElementsByTagName("description")[0].textContent;

        const taskDiv = document.createElement("div");
        taskDiv.className = `task ${completed ? "completed" : ""}`;
        paragraph = document.createElement("p");
        paragraph.textContent = description;
        taskDiv.appendChild(paragraph);

        const buttonDiv = document.createElement("div");

        const completeBtn = document.createElement("button");
        completeBtn.textContent = completed ? "Anuluj" : "Zakończone";
        completeBtn.style.width = "5rem";
        completeBtn.onclick = () => toggleComplete(id);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Usuń";
        deleteBtn.style.width = "3rem";
        deleteBtn.onclick = () => deleteTask(id);

        buttonDiv.appendChild(completeBtn);
        buttonDiv.appendChild(deleteBtn);
        taskDiv.appendChild(buttonDiv);
        taskList.appendChild(taskDiv);
    }
}

function addTask(description) {
    if (!xmlDoc) {
        alert("Nie załadowano żadnego XML plika. Pomyślny XML plik stworzono.");
        initDefXML();
    }

    const tasks = xmlDoc.getElementsByTagName("tasks")[0];
    const newTask = xmlDoc.createElement("task");
    const taskId = xmlDoc.getElementsByTagName("task").length + 1;

    newTask.setAttribute("id", taskId);
    newTask.setAttribute("completed", "false");

    const descNode = xmlDoc.createElement("description");
    descNode.textContent = description;

    newTask.appendChild(descNode);
    tasks.appendChild(newTask);

    loadTasks();
}

function toggleComplete(id) {
    const task = xmlDoc.querySelector(`task[id="${id}"]`);
    const completed = task.getAttribute("completed") === "true";
    task.setAttribute("completed", !completed);

    loadTasks();
}

function deleteTask(id) {
    const task = xmlDoc.querySelector(`task[id="${id}"]`);
    task.parentNode.removeChild(task);

    loadTasks();
}

document.getElementById("save-button").addEventListener("click", function () {
    if (!xmlDoc) {
        alert("Brak XML pliku!");
        return;
    }

    const serializer = new XMLSerializer();
    const xmlString = serializer.serializeToString(xmlDoc);

    const blob = new Blob([xmlString], { type: "application/xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "tasks.xml";
    a.click();
});

document.getElementById("add-task-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const taskInput = document.getElementById("task-input");
    const description = taskInput.value.trim();
    if (description) {
        addTask(description);
        taskInput.value = ""; 
    }
});

function initDefXML() {
    const parser = new DOMParser();
    const defXML = `<?xml version="1.0" encoding="utf-8"?>
                    <!DOCTYPE tasks [
                        <!ELEMENT tasks (task*)>
                        <!ELEMENT task (description)>
                        <!ELEMENT description (#PCDATA)>
                        <!ATTLIST task id CDATA #REQUIRED completed (true | false) #REQUIRED>]>
                    <tasks></tasks>`;
    xmlDoc = parser.parseFromString(defXML, "text/xml");
    console.log("Initialized a new XML structure.");
}
