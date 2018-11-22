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
            reflection: '',
            submitted: false,
            success: true,
            error: false,
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
    
    setDefaults() {
        this.setState({
            success: false,
            error: false
        })
    }

    setSuccess() {
        this.setState({
            success: true
        })
    }

    setFail() {
        this.setState({
            error: true
        })
    }

    showAlert() {
        if(this.state.success) {
            SuccessAlert("Agenda created successfully")
        } else {
            DangerAlert("Failed to create agenda.")
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setDefaults()
        const that = this;

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
            method: 'post',
            body: JSON.stringify(data)
        }).then(function(response) {
            if(response.status === 200 || response.status === 201) {
                that.setSuccess();
                alert('success');
            } else {
                this.state.error = true
                that.setFail();
                alert('fail');
            }
        }).then(function(data) {
            that.showAlert()
        })
    }

    render() {
        return (
            <div>
                <NavBar/>
                <div className="row">
                <div className="col-sm-4"></div>
                <div className="col-sm-4">
                    <center><h1>{this.props.form_name || this.state.form_name}</h1>
                        {SuccessAlert("Hello, there! Created with love by adhithyan vijayakumar.")}
                    </center>
                    <center>
                    <form onSubmit={this.handleSubmit}>
                        <div>
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
                        <div >
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
                        <div>
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
                    </center>
                </div>
                <div className="col-sm-4"></div>
                </div>
            </div>
        );
    }
}

function SuccessAlert(props) {
    return (
        <div class="alert alert-success" role="alert">
            {props}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    )
}

function DangerAlert(props) {
    return (
        <div class="alert alert-danger" role="alert">
            {props}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    )
}

export default AgendaForm;