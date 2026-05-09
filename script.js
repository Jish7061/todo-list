const taskForm = document.getElementById('new-task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filters button');

let tasks = JSON.parse(localStorage.getItem('todoTasks') || '[]');
let activeFilter = 'all';

function saveTasks() {
  localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = 'task-item';
  li.dataset.id = task.id;

  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', () => {
    task.completed = checkbox.checked;
    saveTasks();
    renderTasks();
  });

  const span = document.createElement('span');
  span.textContent = task.text;
  if (task.completed) {
    span.classList.add('completed');
  }

  label.appendChild(checkbox);
  label.appendChild(span);

  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-button';
  deleteButton.type = 'button';
  deleteButton.textContent = '✕';
  deleteButton.title = 'Delete task';
  deleteButton.addEventListener('click', () => {
    tasks = tasks.filter((item) => item.id !== task.id);
    saveTasks();
    renderTasks();
  });

  li.appendChild(label);
  li.appendChild(deleteButton);
  return li;
}

function renderTasks() {
  taskList.innerHTML = '';
  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'active') return !task.completed;
    if (activeFilter === 'completed') return task.completed;
    return true;
  });

  if (filteredTasks.length === 0) {
    const emptyState = document.createElement('li');
    emptyState.className = 'task-item';
    emptyState.innerHTML = '<span style="color: var(--muted);">No tasks to show.</span>';
    taskList.appendChild(emptyState);
    return;
  }

  filteredTasks.forEach((task) => taskList.appendChild(createTaskElement(task)));
}

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.unshift({
    id: Date.now().toString(),
    text,
    completed: false,
  });

  taskInput.value = '';
  saveTasks();
  renderTasks();
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
    renderTasks();
  });
});

renderTasks();
