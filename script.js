document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    
    const addButton = document.getElementById('add-todo');
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
    li.textContent = task;


    li.addEventListener('click', () => {
        li.classList.toggle('completed');
        saveTodos();
    });

    
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-btn';
    deleteButton.onclick = () => {
        li.remove();
        saveTodos();
    };

    li.appendChild(deleteButton);
    return li;
}

function saveTodos() {
    const todos = [];
    document.querySelectorAll('#todo-list li').forEach(li => {
        todos.push({
            text: li.firstChild.textContent,
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