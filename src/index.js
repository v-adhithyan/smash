import React from 'react';
import ReactDOM from 'react-dom';
import renderHTML from 'react-render-html';
import SplitterLayout from 'react-splitter-layout';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import AgendaForm from './forms.js';
import './index.css';
import NavBar from './navbar.js';
import agendaApi from './constants.js';

const rmj = require('render-markdown-js')

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
            .then(data => this.setState({ agendas: data }));
    }

    render() {
        let agenda_raw = "";
        console.log(this.state.agendas);
        for (var i = 0; i < this.state.agendas.length; i++) {
            agenda_raw += this.state.agendas[i].agenda_text + "\n";
        }
        const agenda_html = rmj(agenda_raw)
        return (
            <div>
                <NavBar/>
                    {renderHTML(agenda_html)}
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

