import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Container, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import { InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Temp from './Temp';
const API_BASE_URL = 'http://127.0.0.1:8081/api';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [getalltasks, setAllTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    name: '',
    assignee: '',
    project: '',
    startTime: '',
  });
  const [updatedTask, setUpdatedTask] = useState({ id: '', name: '', assignee: '', project: '' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [searchQuery]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/findByName/${searchQuery}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchAllTasks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks`);
      setAllTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  const addTask = async () => {
    try {
      const response = await axios.put(API_BASE_URL, newTask);
      setTasks([...tasks, response.data]);
      setNewTask({
        name: '',
        assignee: '',
        project: '',
        startTime: '',
      });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTask = async () => {
    try {
      await axios.put(API_BASE_URL, updatedTask);
      fetchTasks();
      setUpdatedTask({ id: '', name: '', assignee: '', project: '' });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await axios.delete(API_BASE_URL, { params: { id: taskId } });
      fetchTasks();
      console.log('Deleted task:', response.data);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };


  // Container 2

  const [assigneeName, setAssigneeName] = useState('');
  const [tasksByAssignee, setTasksByAssignee] = useState([]);
  const [error, setError] = useState(null);
  const getTasksByAssignee = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/findByAssignee/${assigneeName}`);
      setTasksByAssignee(response.data);
      setError(null);
    } catch (error) {
      setError('No tasks found for the specified assignee.');
      setTasksByAssignee([]);
    }
  };
  //const sortedTasks = tasksByAssignee.slice().sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ display: 'flex' ,flexDirection:'column'}}>
      {/* Container 1 */}
      <Container maxWidth="sm" style={{ margin: '20px 10px 0px 20px',width:'100%', fontFamily: 'Arial, sans-serif', background: '#ffff4d', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)' }}>
        <Typography variant="h3" align="center" gutterBottom style={{ color: 'black', fontSize: '28px' }}>
          Task Manager
        </Typography>

        <div style={{ marginBottom: '20px' }}>
          <Typography variant="h4" style={{ color: 'black' }}>Add Task</Typography>
          <TextField
            label="Task Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          />
          <TextField
            label="Assignee"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newTask.assignee}
            onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
          />
          <TextField
            label="Project"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newTask.project}
            onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
          />
          <TextField
            variant="outlined"
            fullWidth
            margin="normal"
            type="datetime-local"
            value={newTask.startTime}
            onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })}
          />
          <Button variant="contained" style={{ background: '#00BFFF', color: 'black' }} onClick={addTask}>
            Add Task
          </Button>
        </div>
      </Container>

      <Container maxWidth="sm" style={{ margin: '20px 10px 10px 20px', width:'100%',fontFamily: 'Arial, sans-serif', background: '#ffff4d', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)' }}>
        
        <div>
          <Typography variant="h4" style={{ color: 'black' }}>Task List</Typography>
          <TextField
            label="Search by Task Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          {tasks.length === 0 && (
            <>
              {tasks.map((task) => (
                <ListItem key={task.id} style={{ background: '#ffffff', borderRadius: '5px', margin: '5px 0', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <ListItemText primary={`${task.name} - ${task.assignee} - ${task.project}`} />
                  <Button variant="outlined" style={{ color: '#00BFFF', marginRight: '5px' }} onClick={() => setUpdatedTask(task)}>
                    Edit
                  </Button>
                  <Button variant="outlined" style={{ color: '#FF4500' }} onClick={() => deleteTask(task.id)}>
                    Delete
                  </Button>
                </ListItem>
              ))}
            </>
          )}

          {tasks.length > 0 && (
            <List>
              {tasks.map((task) => (
                <ListItem key={task.id} style={{ background: '#ffffff', borderRadius: '5px', margin: '5px 0', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <ListItemText
                    primary={`${task.name} - ${task.assignee} - ${task.project}`}
                    secondary={`Start Time:  ${task.startTime}`} // Move startTime to secondary prop
                  />
                  <Button variant="outlined" style={{ color: '#00BFFF', marginRight: '5px' }} onClick={() => setUpdatedTask(task)}>
                    Edit
                  </Button>
                  <Button variant="outlined" style={{ color: '#FF4500' }} onClick={() => deleteTask(task.id)}>
                    Delete
                  </Button>
                </ListItem>
              ))}
            </List>
          )}
        </div>

        {updatedTask.id && (
          <div style={{ marginTop: '20px' }}>
            <Typography variant="h4" style={{ color: 'black' }}>Edit Task</Typography>
            <TextField
              label="Task Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={updatedTask.name}
              onChange={(e) => setUpdatedTask({ ...updatedTask, name: e.target.value })}
            />
            <TextField
              label="Assignee"
              variant="outlined"
              fullWidth
              margin="normal"
              value={updatedTask.assignee}
              onChange={(e) => setUpdatedTask({ ...updatedTask, assignee: e.target.value })}
            />
            <TextField
              label="Project"
              variant="outlined"
              fullWidth
              margin="normal"
              value={updatedTask.project}
              onChange={(e) => setUpdatedTask({ ...updatedTask, project: e.target.value })}
            />
            <Button variant="contained" style={{ background: '#00BFFF', color: 'black' }} onClick={updateTask}>
              Update Task
            </Button>
          </div>
        )}
        
      </Container>
      </div>
      {/* Container 2 */}
      <div style = {{display :'flex',flexDirection:'column',width :'50%'}}>
        <Container maxWidth="sm" style={{ margin: '20px 0px 0px 5px',width:'100%' ,fontFamily: 'Arial, sans-serif', background: '#ffff4d', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)' }}>
          {/* <Temp /> */}
          <Typography variant="h4" style={{ color: 'black' }}>Enter Assignee Name</Typography>
          <TextField
            label="Assignee Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={assigneeName}
            onChange={(e) => setAssigneeName(e.target.value)}
          />
          <Button
            variant="contained"
            style={{ background: '#00BFFF', color: 'black', marginTop: '10px' }}
            onClick={getTasksByAssignee}
          >
            Get Tasks
          </Button>

          {error && (
            <Typography variant="body2" style={{ color: 'red', marginTop: '10px' }}>
              {error}
            </Typography>
          )}

          {tasksByAssignee.map((task) => (
            <ListItem key={task.id} style={{ background: '#ffffff', borderRadius: '5px', margin: '5px 0', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <ListItemText
                primary={`${task.name} - ${task.assignee} - ${task.project}`}
                secondary={`Start Time:  ${task.startTime}`} // Move startTime to secondary prop
              />          </ListItem>
          ))}
        </Container>
        <Container maxWidth="sm" style={{ margin: '20px 0px 10px 5px', width:'100%',fontFamily: 'Arial, sans-serif', background: '#ffff4d', padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)' }}>
          <Typography variant="h4" style={{ color: 'black' }}>Get All Tasks</Typography>
          <Button
            variant="contained"
            style={{ background: '#00BFFF', color: 'black', marginTop: '10px' }}
            onClick={fetchAllTasks}
          >
            Get ALL Tasks
          </Button>
          {error && (
            <Typography variant="body2" style={{ color: 'red', marginTop: '10px' }}>
              {error}
            </Typography>
          )}

          {getalltasks.map((task) => (
            <ListItem key={task.id} style={{ background: '#ffffff', borderRadius: '5px', margin: '5px 0', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <ListItemText
                primary={`${task.name} - ${task.assignee} - ${task.project}`}
                secondary={`Start Time:  ${task.startTime}`} // Move startTime to secondary prop
              />          </ListItem>
          ))}
        </Container>
      </div>
    </div>
  );
};

export default App;