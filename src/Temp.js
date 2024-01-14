import React , {useState , useEffect} from 'react';
import axios from 'axios';

const tasksArray = [
    // Task 1 - Task 10 with the same assignee name "John Doe"
    ...Array.from({ length: 10 }, (_, index) => ({
        id: `${index + 1}`,
        name: `Task ${index + 1}`,
        assignee: "John Doe",
        project: `Project ${index + 1}`,
        startTime: `2024-01-13T${8 + index}:00:00`,     })),
    // Task 11 - Task 20 with the same assignee name "Alice Smith"
    ...Array.from({ length: 10 }, (_, index) => ({
        id: `${index + 11}`,
        name: `Task ${index + 11}`,
        assignee: "Alice Smith",
        project: `Project ${index + 11}`,
        startTime: `2024-01-13T${14 + index}:30:00`, 
    }))
];


const apiUrl = 'http://localhost:8081/api';

const Temp = () => {
  const postTaskToDatabase = async (task) => {
    try {
      const response = await axios.put(apiUrl, task);
      console.log(`Task with ID ${task.id} posted successfully. Response:`, response.data);
    } catch (error) {
      console.error(`Error posting task with ID ${task.id}:`, error.message);
    }
  };

  const handleUploadClick = async () => {
    for (const task of tasksArray) {
      await postTaskToDatabase(task);
    }
  };

  return (
    <div>
      <button onClick={handleUploadClick}>Upload Tasks to Database</button>
    </div>
  );
};

export default Temp;
