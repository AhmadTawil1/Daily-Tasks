// API base URL
const API_URL = '/api/tasks';

// DOM elements
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const titleInput = document.getElementById('title');
const startTimeInput = document.getElementById('startTime');
const durationInput = document.getElementById('duration');
const endTimePreview = document.getElementById('endTimePreview');

// Calculate end time from start time and duration
function calculateEndTime(startTime, duration) {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0);

    const durationHours = Math.floor(duration);
    const durationMinutes = Math.round((duration - durationHours) * 60);

    startDate.setHours(startDate.getHours() + durationHours);
    startDate.setMinutes(startDate.getMinutes() + durationMinutes);

    return `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`;
}

// Update end time preview
function updateEndTimePreview() {
    const startTime = startTimeInput.value;
    const duration = parseFloat(durationInput.value);

    if (startTime && duration) {
        const endTime = calculateEndTime(startTime, duration);
        endTimePreview.textContent = endTime;
        endTimePreview.style.animation = 'pulse 0.3s ease';
        setTimeout(() => {
            endTimePreview.style.animation = '';
        }, 300);
    } else {
        endTimePreview.textContent = '--:--';
    }
}

// Event listeners for preview
startTimeInput.addEventListener('change', updateEndTimePreview);
durationInput.addEventListener('input', updateEndTimePreview);

// Load all tasks
async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

// Render tasks
function renderTasks(tasks) {
    if (tasks.length === 0) {
        taskList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📋</div>
                <p>No tasks yet. Add your first task above!</p>
            </div>
        `;
        return;
    }

    taskList.innerHTML = tasks.map((task, index) => `
        <div class="task-item" data-id="${task.id}" style="animation-delay: ${index * 0.1}s">
            <div class="task-header">
                <div class="task-title">${task.title}</div>
                <div class="task-actions">
                    <button class="btn-icon edit" onclick="editTask(${task.id})">✏️ Edit</button>
                    <button class="btn-icon delete" onclick="deleteTask(${task.id})">🗑️ Delete</button>
                </div>
            </div>
            <div class="task-details">
                <div class="task-time">
                    <span class="time-badge">${task.start_time}</span>
                    <span>→</span>
                    <span class="time-badge">${task.end_time}</span>
                </div>
                <div class="duration-badge">${task.duration}h</div>
            </div>
            <div id="edit-form-${task.id}" style="display: none;"></div>
        </div>
    `).join('');
}

// Create new task
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const taskData = {
        title: titleInput.value,
        start_time: startTimeInput.value,
        duration: parseFloat(durationInput.value)
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });

        if (response.ok) {
            taskForm.reset();
            endTimePreview.textContent = '--:--';
            await loadTasks();
        }
    } catch (error) {
        console.error('Error creating task:', error);
    }
});

// Edit task
function editTask(taskId) {
    const taskItem = document.querySelector(`[data-id="${taskId}"]`);
    const editFormContainer = document.getElementById(`edit-form-${taskId}`);

    // Get current task data
    const title = taskItem.querySelector('.task-title').textContent;
    const timeBadges = taskItem.querySelectorAll('.time-badge');
    const startTime = timeBadges[0].textContent;
    const endTime = timeBadges[1].textContent;

    // Show edit form
    editFormContainer.style.display = 'block';
    editFormContainer.innerHTML = `
        <div class="edit-form">
            <input type="text" id="edit-title-${taskId}" value="${title}" placeholder="Task title">
            <input type="time" id="edit-start-${taskId}" value="${startTime}">
            <input type="time" id="edit-end-${taskId}" value="${endTime}">
            <label>
                <input type="checkbox" id="edit-cascade-${taskId}" checked>
                Update following tasks
            </label>
            <button class="btn-save" onclick="saveTask(${taskId})">💾 Save</button>
            <button class="btn-cancel" onclick="cancelEdit(${taskId})">✖️ Cancel</button>
        </div>
    `;
}

// Save edited task
async function saveTask(taskId) {
    const taskData = {
        title: document.getElementById(`edit-title-${taskId}`).value,
        start_time: document.getElementById(`edit-start-${taskId}`).value,
        end_time: document.getElementById(`edit-end-${taskId}`).value,
        cascade: document.getElementById(`edit-cascade-${taskId}`).checked
    };

    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });

        if (response.ok) {
            const tasks = await response.json();
            renderTasks(tasks);
        }
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

// Cancel edit
function cancelEdit(taskId) {
    const editFormContainer = document.getElementById(`edit-form-${taskId}`);
    editFormContainer.style.display = 'none';
    editFormContainer.innerHTML = '';
}

// Delete task
async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            await loadTasks();
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// Initialize
loadTasks();

// ===== TASK BANK FUNCTIONALITY =====

let taskBank = [];

// Load task bank from localStorage
function loadTaskBank() {
    const saved = localStorage.getItem('taskBank');
    if (saved) {
        taskBank = JSON.parse(saved);
        renderTaskBank();
    }
}

// Save task bank to localStorage
function saveTaskBank() {
    localStorage.setItem('taskBank', JSON.stringify(taskBank));
}

// Render task bank
function renderTaskBank() {
    const taskBankEl = document.getElementById('taskBank');

    if (taskBank.length === 0) {
        taskBankEl.innerHTML = `
            <div class="empty-state-small">
                <p>Add tasks here as reminders</p>
            </div>
        `;
        return;
    }

    taskBankEl.innerHTML = taskBank.map((task, index) => `
        <div class="bank-item">
            <div class="bank-item-text">${task}</div>
            <div class="bank-item-actions">
                <button class="btn-bank-action" onclick="scheduleFromBank(${index})" title="Add to schedule">📅</button>
                <button class="btn-bank-action delete" onclick="removeFromBank(${index})" title="Remove">✖️</button>
            </div>
        </div>
    `).join('');
}

// Add task to bank
function addToBank() {
    const input = document.getElementById('bankTaskInput');
    const taskText = input.value.trim();

    if (taskText) {
        taskBank.push(taskText);
        saveTaskBank();
        renderTaskBank();
        input.value = '';
    }
}

// Add to bank on Enter key
document.addEventListener('DOMContentLoaded', () => {
    const bankInput = document.getElementById('bankTaskInput');
    if (bankInput) {
        bankInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addToBank();
            }
        });
    }
    loadTaskBank();
});

// Remove task from bank
function removeFromBank(index) {
    taskBank.splice(index, 1);
    saveTaskBank();
    renderTaskBank();
}

// Schedule task from bank
function scheduleFromBank(index) {
    const taskText = taskBank[index];
    document.getElementById('title').value = taskText;

    // Optionally remove from bank after scheduling
    // removeFromBank(index);

    // Scroll to form
    document.getElementById('title').focus();
}
