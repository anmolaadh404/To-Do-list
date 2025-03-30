document.addEventListener('DOMContentLoaded', () => {
    loadTodos();

   
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear All';
    clearButton.id = 'clear-todos';
    clearButton.onclick = clearTodos;
    document.querySelector('main').appendChild(clearButton);
});

function addTodo() {
    const input = document.getElementById('todo-input');
    const task = input.value.trim();
    if (task === '') return;

    const li = createTodoElement(task);
    document.getElementById('todo-list').appendChild(li);

    saveTodos();
    input.value = '';
}

function createTodoElement(task) {
    const li = document.createElement('li');

   
    const taskSpan = document.createElement('span');
    taskSpan.textContent = task;
    taskSpan.className = 'task-text';

    
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
    li.appendChild(editButton);
    li.appendChild(deleteButton);
    return li;
}

function editTask(taskSpan) {
    const currentText = taskSpan.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'edit-input';

    // Replace the span with the input field
    taskSpan.replaceWith(input);

    // Save changes on blur or Enter key
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
            completed: li.classList.contains('completed')
        });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => {
        const li = createTodoElement(todo.text);
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
