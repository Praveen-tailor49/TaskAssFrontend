import React from 'react';
import ToDo from './components/ToDo/todo';
import Doing from './components/Doing/doing';
import Done from './components/Done/done';
import './ToDoApp.css';

class ToDoApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            task_list: [],
            task_list_all: []
        };
        this.newTaskHandler = this.newTaskHandler.bind(this);
        this.taskClearHandler = this.taskClearHandler.bind(this);
        this.taskCompleteHandler = this.taskCompleteHandler.bind(this);
        this.onDescpChange = this.onDescpChange.bind(this);
    }

    componentWillMount = () => {
        this.fetch_Task_list()
    }

    fetch_Task_list = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch("https://task-backend-b2k4.onrender.com/task", requestOptions)
            .then(response => response.json())
            .then(result => {
                this.setState(prevState => {
                    return {
                        task_list: result
                    };
                });
            }
            )
            .catch(error => console.log('error', error));
    }

    newTaskHandler(descp) {
        var requestOptions = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: "task" + new Date().getTime(),
                description: descp,
                finished: false
            }),
            redirect: 'follow'
        };

        fetch("https://task-backend-b2k4.onrender.com/task", requestOptions)
            .then(response => response.json())
            .then(result => {
                this.fetch_Task_list()
            }
            )
            .catch(error => console.log('error', error));
    }

    createList() {
        fetch("http://localhost:3002/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state.singledata)
        }).then(
            this.setState({
                singledata: {
                    title: "",
                    author: ""
                }
            })
        );
    }


    taskCompleteHandler(id) {
        const result = this.state.task_list.map(item => {
            if (item.id === id){
                item.finished = !item.finished;
                return item;
            }
        })
        const data = result.filter(function( element ) {
            return element !== undefined;
         });
        var requestOptions = {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                description: data[0].description,
                finished: true
            }),
            redirect: 'follow'
        };

        fetch("https://task-backend-b2k4.onrender.com/task/"+id, requestOptions)
            .then(response => response.json())
            .then(result => {
                this.fetch_Task_list()
            }
            )
            .catch(error => console.log('error', error));
    }

    taskClearHandler(id) {
        var requestOptions = {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            },
            redirect: 'follow'
        };

        fetch("https://task-backend-b2k4.onrender.com/task/"+id, requestOptions)
            .then(response => response.json())
            .then(result => {
                this.fetch_Task_list()
            }
            )
            .catch(error => console.log('error', error));
    }

    onDescpChange(id, new_descp) {
        var requestOptions = {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                description: new_descp,
                finished: false
            }),
            redirect: 'follow'
        };

        fetch("https://task-backend-b2k4.onrender.com/task/"+id, requestOptions)
            .then(response => response.json())
            .then(result => {
                this.fetch_Task_list()
            }
            )
            .catch(error => console.log('error', error));
    }

    render() {
        return (
            <div className="toDoApp">
                <ToDo task_list={this.state.task_list} newTaskHandler={this.newTaskHandler} onDescpChange={this.onDescpChange} />
                <Doing task_list={this.state.task_list} taskCompleteHandler={this.taskCompleteHandler} onDescpChange={this.onDescpChange} />
                <Done task_list={this.state.task_list} taskClearHandler={this.taskClearHandler} onDescpChange={this.onDescpChange} />
            </div>
        );
    }
}


export default ToDoApp;