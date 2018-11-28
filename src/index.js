import React from 'react';
import ReactDOM from 'react-dom';
import renderHTML from 'react-render-html';
import SplitterLayout from 'react-splitter-layout';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import AgendaForm from './forms.js';
import './index.css';
import NavBar from './navbar.js';
import agendaApi from './constants.js';
import {FlippingCard, FlippingCardFront} from 'react-ui-cards';
import {DangerAlert, SuccessAlert, InfoAlert} from './alerts.js';
//import LinkButton from './buttons.js'
import DeleteAgenda from './actions.js';


const rmj = require('render-markdown-js')

function AgendaCard(name, content, id) {
    name = "agenda " + name
    return(
            <div className="col-sm-4">
                <div className={name}>
                    {content}
                    <center>
                        <button className="btn btn-primary btn-primary-spacing">Edit</button>
                        <button className="btn btn-primary btn-primary-spacing" onClick={() => {DeleteAgenda(id)} }>Delete</button>
                    </center>
                </div>
            </div>
    )
}

function makeRows(cards) {

}

class App extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            agendas: [],
            count: 0,
            previous: null,
            next: null,
            api: props.api,
            failedToFetch: false,
            failMessage: ""
        };
        this.showFetchFailedBanner = this.showFetchFailedBanner.bind(this);
    }

    showFetchFailedBanner(error) {
        console.log("error banner" + error)
        this.setState({
            failedToFetch: true,
            failMessage: error
        })
    }

    componentDidMount() {
        let that = this;
        let api = agendaApi;
        if(this.state.api != null) {
            api = this.state.api;
        }
        fetch(api, {
            crossDomain: true,
            method: 'GET'
        })
            .then(response => {
                return response.json();
            })
            .then(data => this.setState({ 
                count: data['count'],
                previous: data['previous'],
                next: data['next'],
                agendas: data['results'], 
            }))
            .catch(error => that.showFetchFailedBanner(error.message));
    }

    showNext() {
        if(this.state.next) {

        }
    }

    showPrevious() {
        if(this.state.previous) {

        }
    }

    render() {
        let cards = [];

        for (var i = 0; i < this.state.agendas.length; i++) {
            let agenda_raw = this.state.agendas[i].agenda_text ;
            let agenda_html = rmj(agenda_raw);
            let rendered_agenda = renderHTML(agenda_html);
            let name = "agenda-col-" + ((i%4)+1);
            cards.push(AgendaCard(name, rendered_agenda, this.state.agendas[i].id))
        }
        
       
        return (
            <div>
                <NavBar/>
                <div class="container">
                        {
                            this.state.failedToFetch &&
                            <div>
                                <center>
                                    <DangerAlert message={this.state.failMessage}/>
                                </center>
                            </div>
                        } 
                        {
                            !this.state.failedToFetch &&
                            <div>
                                <center>
                                    <InfoAlert message={"Showing " + (this.state.count) + " agendas."} />
                                        { 
                                            this.state.previous &&
                                            <button className="btn btn-link btn-active btn-custom">
                                                Previous
                                            </button>
                                        }
                                        
                                        {
                                            this.state.next &&
                                            <button className="btn btn-link btn-active btn-custom" onClick={this.showNext()}>
                                                Next
                                            </button>
                                        }
                                </center>
                                <div>
                                {cards}
                                </div>
                            </div>
                        }
                </div>
            </div>
        )
    }
}

class Root extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Route exact path='/' component={App} />
                    <Route path='/agenda' component={AgendaForm} />
                </div>
            </Router>
        )
    }
}

ReactDOM.render(
   <Root/>,
    document.getElementById('root')
);

