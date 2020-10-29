import React from 'react';
import TaskForm from './TaskForm';
import Task from './Task';

class TaskList extends React.Component {
    state = {
        openTaskForm: false,
    }

    openTaskForm = () => {
        this.setState({openTaskForm: true})
    }

    closeTaskForm = ()=> {
        this.setState({openTaskForm: false})
    }

    render() {
        return(
            <div className='task-list-container container-short'>
                <div className='task-list-overflow'>
                    {
                        !this.props.taskList ? null : this.props.taskList.map((task, index) => (
                            //Determine if the task has a mod different from 0 to add a different dot color
                            index%2 !== 0 ? <Task task={task} key={task.id} dotLightColor={true} />
                                : <Task task={task} key={task.id} />
                        ))
                    }
                </div>
                <div className='task-button-container' onClick={this.openTaskForm}>
                    <span className='button-task button'>
                        <span className="material-icons icon">
                            add
                        </span>
                        Add Task
                    </span>
                </div>
                {
                    this.state.openTaskForm ? <TaskForm
                                                month={this.props.month}
                                                year={this.props.year}
                                                day={this.props.day}
                                                fullMonth={this.props.fullMonth}
                                                closeTaskForm={this.closeTaskForm}
                                                addTask={this.props.addTask}
                                              /> : null
                }
            </div>
        );
    }

}

export default TaskList;