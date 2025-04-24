const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const themeToggle = document.getElementById('themeToggle');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks(filtro = 'todas') {
      taskList.innerHTML = '';
      let filtered = tasks;

      if (filtro === 'completadas') {
        filtered = tasks.filter(t => t.completada);
      } else if (filtro === 'pendientes') {
        filtered = tasks.filter(t => !t.completada);
      }

      filtered.forEach(task => {
        const taskEl = document.createElement('div');
        taskEl.className = `task ${task.completada ? 'completed' : ''}`;
        taskEl.innerHTML = `
          <div>
            <input type="checkbox" ${task.completada ? 'checked' : ''} onchange="toggleComplete(${task.id})">
            <span>${task.texto} - ${task.fecha}</span>
            <span class="priority ${task.prioridad}">${task.prioridad}</span>
          </div>
          <button onclick="deleteTask(${task.id})">🗑️</button>
        `;
        taskList.appendChild(taskEl);
      });
    }

    taskForm.addEventListener('submit', e => {
      e.preventDefault();
      const texto = document.getElementById('taskText').value.trim();
      const fecha = document.getElementById('taskDate').value;
      const prioridad = document.getElementById('taskPriority').value;

      if (!texto) return alert('La tarea no puede estar vacía.');

      const nuevaTarea = {
        id: Date.now(),
        texto,
        fecha,
        prioridad,
        completada: false
      };

      tasks.push(nuevaTarea);
      saveTasks();
      renderTasks();
      taskForm.reset();
    });

    function toggleComplete(id) {
      tasks = tasks.map(t => t.id === id ? { ...t, completada: !t.completada } : t);
      saveTasks();
      renderTasks();
    }

    function deleteTask(id) {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      renderTasks();
    }

    themeToggle.addEventListener('change', e => {
      document.body.className = e.target.value === 'dark' ? 'dark' : '';
    });

    renderTasks(); // Al cargar la página
