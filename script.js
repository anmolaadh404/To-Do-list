document.addEventListener('DOMContentLoaded', () => {
    loadTodos();

    
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }

    
    startClock();

    
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear All';
    clearButton.id = 'clear-todos';
    clearButton.onclick = clearTodos;
    document.querySelector('main').appendChild(clearButton);
});

function startClock() {
    const clockElement = document.getElementById('clock');
    function updateClock() {
        const now = new Date();
        clockElement.textContent = now.toLocaleTimeString(); 
    }
    updateClock(); 
    setInterval(updateClock, 1000); 
}

function addTodo() {
    const input = document.getElementById('todo-input');
    const task = input.value.trim();
    if (task === '') return;

    const createdAt = new Date().toLocaleString(); 
    const reminderTime = prompt('Set a reminder time in minutes (optional):'); 

    const li = createTodoElement(task, createdAt, reminderTime);
    document.getElementById('todo-list').appendChild(li);

    saveTodos();
    input.value = '';
}

function createTodoElement(task, createdAt, reminderTime) {
    const li = document.createElement('li');

    const taskSpan = document.createElement('span');
    taskSpan.textContent = task;
    taskSpan.className = 'task-text';

    const timeSpan = document.createElement('span');
    timeSpan.textContent = `Created at: ${createdAt}`;
    timeSpan.className = 'time-text';

    li.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') {
            li.classList.toggle('completed');
            saveTodos();
        }
    });

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'edit-btn';
    editButton.onclick = () => editTask(taskSpan);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-btn';
    deleteButton.onclick = () => {
        li.remove();
        saveTodos();
    };

    li.appendChild(taskSpan);
    li.appendChild(timeSpan);
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    if (reminderTime && !isNaN(reminderTime)) {
        setTimeout(() => {
            sendNotification(task);
        }, reminderTime * 60000); 
    }

    return li;
}

function sendNotification(task) {
    if (Notification.permission === 'granted') {
        new Notification('Task Reminder', {
            body: `Reminder: "${task}" is due!`,
            icon: 'https://via.placeholder.com/128'
        });
    } else {
        alert(`Reminder: "${task}" is due!`);
    }
}

function editTask(taskSpan) {
    const currentText = taskSpan.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'edit-input';

    taskSpan.replaceWith(input);

    input.addEventListener('blur', () => saveEdit(input, taskSpan));
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            saveEdit(input, taskSpan);
        }
    });

    input.focus();
}

function saveEdit(input, taskSpan) {
    const newText = input.value.trim();
    if (newText !== '') {
        taskSpan.textContent = newText;
    }
    input.replaceWith(taskSpan);
    saveTodos();
}

function saveTodos() {
    const todos = [];
    document.querySelectorAll('#todo-list li').forEach(li => {
        todos.push({
            text: li.querySelector('.task-text').textContent,
            createdAt: li.querySelector('.time-text').textContent.replace('Created at: ', ''),
            completed: li.classList.contains('completed')
        });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => {
        const li = createTodoElement(todo.text, todo.createdAt, null);
        if (todo.completed) {
            li.classList.add('completed');
        }
        document.getElementById('todo-list').appendChild(li);
    });
}

function clearTodos() {
    if (confirm('Are you sure you want to clear all tasks?')) {
        localStorage.removeItem('todos');
        document.getElementById('todo-list').innerHTML = '';
    }
}
