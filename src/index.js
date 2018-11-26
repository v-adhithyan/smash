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

const rmj = require('render-markdown-js')

function AgendaCard(name, content) {
    name = "agenda " + name
    return(
            <div className="col-sm-4">
                <div className={name}>
                    {content}
                <center>
                    <button className="btn btn-primary btn-primary-spacing">Edit</button>
                    <button className="btn btn-primary btn-primary-spacing">Delete</button>
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
        
        let agenda = agendaApi;
        if(props.api) {
            agenda = props.api
        }
        this.state = {
            agendas: [],
            count: 0,
            previous: null,
            next: null,
            api: this.agenda
        };
    }

    showFetchFailedBanner(error) {
        return (
            <DangerAlert message={error} />
        )
    }

    componentDidMount() {
        let that = this;
        fetch(agendaApi, {
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
            .catch(error => that.showFetchFailedBanner());
    }

    render() {
        let cards = [];

        for (var i = 0; i < this.state.agendas.length; i++) {
            let agenda_raw = this.state.agendas[i].agenda_text ;
            let agenda_html = rmj(agenda_raw);
            let rendered_agenda = renderHTML(agenda_html);
            let name = "agenda-col-" + ((i%4)+1);
            cards.push(AgendaCard(name, rendered_agenda))
        }
        
       
        return (
            <div>
                <NavBar/>
                <div class="container">
                    <center>
                        <InfoAlert message={"Showing " + (this.state.count) + " agendas."} />
                        <button className="btn btn-link btn-active btn-custom">
                            Previous
                        </button>
                        <button className="btn btn-link btn-active btn-custom">
                            Next
                        </button>
                     </center>
                </div>
                <div>
                    {cards}
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

