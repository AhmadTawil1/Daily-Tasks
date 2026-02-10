from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# In-memory task storage
tasks = []
next_id = 1

def calculate_end_time(start_time, duration):
    """Calculate end time from start time and duration"""
    start_hour, start_minute = map(int, start_time.split(':'))
    start_dt = datetime(2000, 1, 1, start_hour, start_minute)
    
    duration_hours = int(duration)
    duration_minutes = int((duration - duration_hours) * 60)
    end_dt = start_dt + timedelta(hours=duration_hours, minutes=duration_minutes)
    
    return end_dt.strftime('%H:%M')

def time_to_minutes(time_str):
    """Convert HH:MM to total minutes"""
    hours, minutes = map(int, time_str.split(':'))
    return hours * 60 + minutes

def minutes_to_time(minutes):
    """Convert total minutes to HH:MM"""
    hours = minutes // 60
    mins = minutes % 60
    return f"{hours:02d}:{mins:02d}"

@app.route('/')
def index():
    """Serve the main HTML page"""
    return render_template('index.html')

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """Get all tasks ordered by order field"""
    return jsonify(sorted(tasks, key=lambda x: x['order']))

@app.route('/api/tasks', methods=['POST'])
def create_task():
    """Create a new task with automatic end time calculation"""
    global next_id
    data = request.json
    
    if not data.get('title') or not data.get('start_time') or not data.get('duration'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    task = {
        'id': next_id,
        'title': data['title'],
        'start_time': data['start_time'],
        'duration': float(data['duration']),
        'end_time': calculate_end_time(data['start_time'], float(data['duration'])),
        'order': len(tasks) + 1
    }
    
    tasks.append(task)
    next_id += 1
    
    return jsonify(task), 201

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """Update a task and cascade changes to dependent tasks"""
    task = next((t for t in tasks if t['id'] == task_id), None)
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    data = request.json
    old_end_time = task['end_time']
    
    if 'title' in data:
        task['title'] = data['title']
    
    # Determine what changed and update accordingly
    start_changed = 'start_time' in data and data['start_time'] != task['start_time']
    end_changed = 'end_time' in data and data['end_time'] != task['end_time']
    
    if start_changed and end_changed:
        # Both times changed - calculate new duration
        task['start_time'] = data['start_time']
        task['end_time'] = data['end_time']
        start_minutes = time_to_minutes(data['start_time'])
        end_minutes = time_to_minutes(data['end_time'])
        duration_minutes = end_minutes - start_minutes
        if duration_minutes < 0:  # Handle overnight tasks
            duration_minutes += 24 * 60
        task['duration'] = duration_minutes / 60.0
    elif start_changed:
        # Only start time changed - keep duration, recalculate end time
        task['start_time'] = data['start_time']
        task['end_time'] = calculate_end_time(task['start_time'], task['duration'])
    elif end_changed:
        # Only end time changed - recalculate duration
        task['end_time'] = data['end_time']
        start_minutes = time_to_minutes(task['start_time'])
        end_minutes = time_to_minutes(data['end_time'])
        duration_minutes = end_minutes - start_minutes
        if duration_minutes < 0:
            duration_minutes += 24 * 60
        task['duration'] = duration_minutes / 60.0
    elif 'duration' in data:
        # Duration changed - recalculate end time
        task['duration'] = float(data['duration'])
        task['end_time'] = calculate_end_time(task['start_time'], task['duration'])
    
    # Cascade changes if requested
    if data.get('cascade', False):
        old_end_minutes = time_to_minutes(old_end_time)
        new_end_minutes = time_to_minutes(task['end_time'])
        time_diff = new_end_minutes - old_end_minutes
        
        if time_diff != 0:
            for t in tasks:
                if t['order'] > task['order']:
                    start_minutes = time_to_minutes(t['start_time'])
                    new_start_minutes = start_minutes + time_diff
                    t['start_time'] = minutes_to_time(new_start_minutes)
                    t['end_time'] = calculate_end_time(t['start_time'], t['duration'])
    
    return jsonify(sorted(tasks, key=lambda x: x['order']))

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Delete a task and reorder remaining tasks"""
    global tasks
    task = next((t for t in tasks if t['id'] == task_id), None)
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    deleted_order = task['order']
    tasks = [t for t in tasks if t['id'] != task_id]
    
    # Reorder subsequent tasks
    for t in tasks:
        if t['order'] > deleted_order:
            t['order'] -= 1
    
    return jsonify({'message': 'Task deleted successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
