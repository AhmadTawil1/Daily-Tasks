# 📅 Daily Schedule App

A beautiful Flask web application for organizing your daily tasks with automatic time calculations and intelligent cascading updates.

![Modern UI](https://img.shields.io/badge/UI-Modern%20Design-blueviolet)
![Flask](https://img.shields.io/badge/Flask-3.0.0-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

### 🎯 Core Functionality
- **Automatic Time Calculations** - Enter start time + duration, get end time automatically
- **Intelligent Edit Logic** - Smart detection of what changed (start time, end time, or both)
- **Cascading Updates** - Changes propagate to all subsequent tasks automatically
- **Task Bank** - Reference list of tasks you want to do, with quick-add to schedule

### 🎨 Modern Design
- **Glassmorphism UI** - Semi-transparent cards with backdrop blur
- **Gradient Backgrounds** - Vibrant purple-to-pink gradients
- **Smooth Animations** - Micro-interactions and hover effects
- **Responsive Layout** - Two-column desktop, stacked mobile
- **Sticky Form** - Task bank and form stay visible while scrolling

### 💾 Data Persistence
- **LocalStorage** - Task bank persists between sessions
- **In-Memory Storage** - No database setup required

## 🚀 Quick Start

### Prerequisites
- Python 3.7+
- pip

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd schedual
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Run the application**
```bash
python app.py
```

4. **Open in browser**
```
http://localhost:5000
```

## 📖 How to Use

### 1. Task Bank (Reference List)
- Add all tasks you want to do today in the Task Bank
- Click 📅 to copy a task to the schedule form
- Click ✖️ to remove from bank
- Tasks persist in browser localStorage

### 2. Schedule Tasks
- Enter task title, start time, and duration
- End time calculates automatically
- Click "Add to Schedule" to add the task

### 3. Edit Tasks
Three intelligent edit modes:

**Change Start Time Only** → Duration preserved, end time recalculates
```
Example: 15:00 → 17:00 (2h)
Change start to 16:00
Result: 16:00 → 18:00 (still 2h)
```

**Change End Time Only** → Duration recalculates
```
Example: 15:00 → 17:00 (2h)
Change end to 16:30
Result: 15:00 → 16:30 (1.5h)
```

**Change Both Times** → Duration recalculates
```
Example: Change 16:00→18:00 to 14:00→16:30
Result: Duration becomes 2.5h
```

### 4. Cascading Updates
- Enable "Update following tasks" when editing
- All subsequent tasks shift by the time difference
- Maintains task relationships and gaps

## 🏗️ Project Structure

```
schedual/
├── app.py                 # Flask backend with API endpoints
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── style.css         # Modern CSS with glassmorphism
│   └── script.js         # Frontend logic and task bank
└── README.md             # This file
```

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Serve main HTML page |
| GET | `/api/tasks` | Get all scheduled tasks |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/<id>` | Update task (with cascade) |
| DELETE | `/api/tasks/<id>` | Delete task |

## 🎨 Design Features

- **Color Scheme**: Dark blue gradient with purple-pink accents
- **Typography**: Inter font family
- **Effects**: Glassmorphism, backdrop blur, gradient text
- **Animations**: Fade in, slide in, pulse, hover effects
- **Layout**: CSS Grid with sticky positioning

## 💡 Example Workflow

```
1. Add tasks to Task Bank:
   - "Morning workout"
   - "Team meeting"
   - "Lunch"
   - "Project work"

2. Schedule from bank:
   - Click 📅 on "Morning workout"
   - Set start: 06:00, duration: 1h
   - Add to schedule

3. Continue scheduling tasks with automatic time calculations

4. Edit if plans change:
   - Workout runs long? Change end time
   - All following tasks adjust automatically
```

## 🛠️ Technologies Used

- **Backend**: Flask 3.0.0
- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: CSS3 with modern features
- **Storage**: In-memory (tasks), localStorage (task bank)
- **Icons**: Emoji (no external dependencies)

## 📝 Future Enhancements

- [ ] Task categories/tags with color coding
- [ ] Task completion tracking
- [ ] Time analytics dashboard
- [ ] Export/import schedules
- [ ] Browser notifications
- [ ] Drag-and-drop reordering
- [ ] Multiple schedule templates

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👤 Author

Built with ❤️ for better productivity

---

**Happy Scheduling! 📅✨**
