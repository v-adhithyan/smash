import React from 'react';
import NavBar from './navbar.js';
import agendaApi from './constants.js';
//import {DangerAlert, SuccessAlert} from './alerts.js';

class AgendaForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            form_name: 'Create Agenda',
            value: '',
            agenda_title: '',
            agenda_text: '',
            reflection: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }
    
    handleSubmit(event) {
        event.preventDefault();

        let data = {
            agenda_title: this.state.agenda_title.toString(),
            agenda_text: this.state.agenda_text.toString(),
            reflection: ""
        }
        fetch(agendaApi, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data),
            mode: "no-cors",
        }).then(function(response) {
            return response.json()
        }).then(function(data) {
            console.log(data);
            SuccessAlert("success")
            //Alert.successAlert("success");
            //<SuccessAlert message="Successfully created agenda."/>
        });
    }

    render() {
        return (
            <div>
                <NavBar/>
                {SuccessAlert("success")}
                <div className="container">
                    <h1>{this.props.form_name || this.state.form_name}</h1>
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label>
                                Title:
                    <input
                                    type="text"
                                    className="form-control"
                                    name="agenda_title"
                                    placeholder="title"
                                    value={this.state.agenda_title}
                                    onChange={this.handleChange} />
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                Agenda:
                    <textarea
                                    type="text"
                                    className="form-control"
                                    name="agenda_text"
                                    placeholder="todo"
                                    value={this.state.agenda_text}
                                    onChange={this.handleChange} />
                            </label>
                        </div>
                        <div className="form-group">
                            <label>
                                Reflection:
                    <textarea
                                    type="text"
                                    className="form-control"
                                    name="reflection"
                                    placeholder="reflection"
                                    value={this.state.reflection}
                                    onChange={this.handleChange}
                                    disabled={true} />
                            </label>
                        </div>
                        <button type="submit" className="btn btn-default btn-custom">Submit</button>
                    </form>
                </div>
            </div>
        );
    }
}

function SuccessAlert(props) {
    return (
        <div class="alert alert-success" role="alert">
            {props}
        </div>
    )
}

export default AgendaForm;