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

        this.state = {
            agendas: [],
        };
    }

    componentDidMount() {
        fetch(agendaApi, {
            crossDomain: true,
            method: 'GET',
        })
            .then(response => {
                console.log(response)
                return response.json();
            })
            .then(data => this.setState({ agendas: data }))
            .catch(error => alert("Failed to fetch. Please try again.!"));
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

