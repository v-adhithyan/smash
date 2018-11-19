import React from 'react';
import ReactDOM from 'react-dom';
import renderHTML from 'react-render-html';
import './index.css';


class SideBar extends React.Component {
    render() {
        return (
            <div className="sidebar" />
        )
    }
}

const API = "http://localhost:8000/api/v1/agenda/"
const rmj = require('render-markdown-js')

class App extends React.Component {
    /*constructor(props) {
        super(props);

        this.state = {
            agendas: [],
        };
    }

    componentDidMount() {
        fetch(API, {
            crossDomain: true,
            method: 'GET',
        })
            .then(response => {
                console.log(response)
                return response.json();
            })
            .then(data => this.setState({ agendas: data }));
    }*/
    renderSidebar() {
        return <SideBar/>;
    }

    render() {
        /*let agenda_raw = "";
        console.log(this.state.agendas);
        for (var i = 0; i < this.state.agendas.length; i++) {
            agenda_raw += this.state.agendas[i].agenda_text + "\n";
        }*/
        let agenda_raw = "# Agenda for 19 Nov 2018\n - Complete React tutorial\n - Adhoc tasks\n - Read auth package\n"
        const agenda_html = rmj(agenda_raw)
        return (
            <div className="sidebar">
            <h1 className="header">Agenda</h1>
                <div>
                    {renderHTML(agenda_html)}
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);

