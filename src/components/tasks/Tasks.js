import React from 'react';
import TaskHeader from './TaskHeader';
import TaskList from './TaskList';

const Tasks = (props) => (
    <aside className='task-container'>
        <TaskHeader
            month={props.month}
            year={props.year}
            day={props.day}
        />
        <TaskList
            month={props.month}
            year={props.year}
            day={props.day}
            taskList={props.taskList}
        />
    </aside>
);

export default Tasks;