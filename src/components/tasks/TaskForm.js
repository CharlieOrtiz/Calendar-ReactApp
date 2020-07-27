import React from 'react';
import WrappedCalendar from '../Containers/WrappedCalendar';
import time from '../../api/time.json';
import HourSelect from './HourSelect';
import RepeatSelect from './RepeatSelect';
import {getIndexWeekAndDay} from '../../helpers/calendarHelpers';

class TaskForm extends React.Component {
    state={
        activeElement: null,
        openCalendar: false,
        displayStart: false,
        displayEnd: false,
        displayRepeat: false,
        fieldErrors: {},
        task: {
            title: !this.props.task ? '' : this.props.task.title, 
            month: this.props.month,
            day: this.props.day,
            year: this.props.year,
            startTime: !this.props.task ? {jsTime: '', time: '' } : this.props.task.startTime,
            endTime: !this.props.task ? {jsTime: '', time: ''} : this.props.task.endTime,
            repeat: !this.props.task ? 'Does not repeat' : this.props.task.repeat
        }
    }

    static getDerivedStateFromProps(nextProps, state) {
        return {
            task: {
                ...state.task,
                month: nextProps.month,
                day: nextProps.day,
                year: nextProps.year
            }
        }
    };

    onFormSubmit = (e) => {
        e.preventDefault();
        this.props.addTask(this.state.task, this.props.fullMonth);
        this.props.closeTaskForm();
    }

    openOnClickElement = (element)=> {
        setTimeout(()=>{
            switch(element) {
                case 'div#calendar': {
                    this.setState({
                        activeElement: element,
                        openCalendar: true
                    });
                    break;
                }
                case 'div#start-select': {
                    this.setState({
                        activeElement: element,
                        displayStart: true
                    });
                    break;
                }
                case 'div#end-select': {
                    this.setState({
                        activeElement: element,
                        displayEnd: true
                    });
                    break;
                }
                case 'div#repeat-select': {
                    this.setState({
                        activeElement: element,
                        displayRepeat: true
                    });
                    break;
                }
                default: {
                    break;
                }
            }
        }, 200);
    }

    closeElement = (element)=>{
        switch(element) {
            case 'div#calendar': {
                this.setState({
                    activeElement: null,
                    openCalendar: false
                });
                break;
            }
            case 'div#start-select': {
                this.setState({
                    activeElement: null,
                    displayStart: false
                });
                break;
            }
            case 'div#end-select': {
                this.setState({
                    activeElement: null,
                    displayEnd: false
                });
                break;
            }
            case 'div#repeat-select': {
                this.setState({
                    activeElement: null,
                    displayRepeat: false
                });
                break;
            }
            default: {
                break;
            }
        }
    }

    hideOnClickOutside = (e, activeElement) => {
        const target = e.target.closest(activeElement);
        if(!target) {
            this.closeElement(activeElement);
        }
            
    }

    closeTaskForm = (e) => {
        if(e.target.className.match('close-taskform')) {
            this.props.closeTaskForm();
        }
    }

    onChangeInputTitle = (e) => {
        const task = Object.assign({}, this.state.task);
        task.title = e.target.value;
        this.setState({task: task});
    }

    selectStartTime = (time, element) => {
        this.getStartTimeAndEndTime(time.jsTime);
        this.closeElement(element);
    }

    selectEndTime = (time, element) => {
        const task = Object.assign({}, this.state.task);
        task.endTime = time;
        this.setState({task: task});
        this.closeElement(element)
    }

    getEndTimes = () => {
        const startTimeIndex = time.findIndex((time) => (
            time === this.state.task.startTime
        ));
        
        const times = time.filter((time, index) => {
            if(index > startTimeIndex){
                return time
            }      
        });

        return times;
    }

    selectRepeatValue = (option, element) => {
        const task = Object.assign({}, this.state.task);
        task.repeat = option;
        this.setState({ task: task});
        this.closeElement(element)
    }

    getRepeatValues = () => {
        let repeatValues = [
            'Does not repeat',
            'Daily',
            'Weekly',
            'Monthly',
            'Anually'
        ];

        let {day} = getIndexWeekAndDay(this.props.fullMonth, this.props.day);
        
        if(day === 0 || day===6) {
            repeatValues.push('Weekends');
        } else {
            repeatValues.push('Every weekday (Monday to Friday)')
        }

        return repeatValues;
    }

    getTime() {
        const startHours = new Date().getHours();
        let startMinutes = new Date().getMinutes() / 60;
        if(startMinutes>0.5) {
            startMinutes = Math.ceil(startMinutes);
        } else {
            startMinutes = 0.5;
        }
        let startTime = startHours + startMinutes;
        if(startTime>23.5) startTime=0;
        return startTime; 
    }

    getStartTimeAndEndTime = (jsStartTime) => {
        let jsEndTime = jsStartTime + 0.5;
        if(jsEndTime === 24) {
            jsEndTime = 0;
        }
        //filter time.json api
        const times = time.filter((time) => {
            if(jsStartTime === time.jsTime || jsEndTime === time.jsTime) {
                return time;
            }
        });
        
        const task = Object.assign({}, this.state.task);
        if(times[0].time > times[1].time ) {
            task.startTime = times[1];
            task.endTime = times[0];
        } else {
            task.startTime = times[0];
            task.endTime = times[1];
        }
        
        this.setState({
            task: task
        });
    }

    componentDidMount() {
        const jsStartTime = this.getTime();
        this.getStartTimeAndEndTime(jsStartTime);
    }

    render() {
        return (
            <div className='close-taskform popup-container' onClick={this.closeTaskForm}>
                <div className='taskform-container' onClick={(e)=>this.hideOnClickOutside(e, this.state.activeElement)}>
                    <form className='taskform' onSubmit={this.onFormSubmit}>
                        <span className="close-taskform material-icons close-icon">
                            close
                        </span>
                        <div>
                            <input type='text' placeholder='Add Title' value={this.state.task.title} onChange={this.onChangeInputTitle}/>
                        </div>
                        <div>
                            <input type='text' value={`${this.state.task.month + 1}/${this.state.task.day}/${this.state.task.year}`} readOnly onClick={()=>this.openOnClickElement('div#calendar')}/>
                        </div>
                        {
                            this.state.openCalendar 
                            ? <div className='min-calendar-container' id='calendar'>
                                <WrappedCalendar 
                                    date={new Date()} 
                                    mincalendar={true}
                                    selectedDay={this.state.task.day} 
                                    closeCalendar={this.closeElement}
                                />
                              </div> 
                            : null
                        }
                        <div>
                            <input type='text' value={this.state.task.startTime.time} readOnly onClick={()=>this.openOnClickElement('div#start-select')}/>
                            <span> - </span>
                            <input type='text' value={this.state.task.endTime.time} readOnly onClick={()=>this.openOnClickElement('div#end-select')}/>
                        </div>
                        {
                            this.state.displayStart 
                            ? <HourSelect 
                                time={time} 
                                timeLength={time.length}
                                selectStartTime={this.selectStartTime}
                                /> 
                            : null
                        }
                        {
                            this.state.displayEnd 
                            ? <HourSelect 
                                time={this.getEndTimes()} 
                                timeLength={time.length}
                                selectEndTime={this.selectEndTime}
                                /> 
                            : null
                        }
                        <div className='repeat-select'>
                            <div className='selected-value' onClick={()=>this.openOnClickElement('div#repeat-select')}>
                                <span>{this.state.task.repeat}</span>
                                <span className="material-icons">arrow_drop_down</span>
                            </div>
                            {
                                this.state.displayRepeat ? <RepeatSelect 
                                                            repeatValues={this.getRepeatValues()} 
                                                            selectRepeatValue={this.selectRepeatValue}
                                                            /> : null
                            }
                        </div>
                        <div>
                            <input type='submit' value='Save'/>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
};

export default TaskForm;