import React from 'react';
import ReactDOM from 'react-dom';
import renderHTML from 'react-render-html';
import { BrowserRouter as Router, Route } from "react-router-dom";
import AgendaForm from './forms.js';
import NewAgendaForm from './new_form.js';
import './index.css';
import NavBar from './navbar.js';
import agendaApi from './constants.js';
import {DangerAlert, InfoAlert} from './alerts.js';
import DeleteAgenda from './actions.js';
import Spinner from './spinner.js'

const rmj = require('render-markdown-js')
const showdown  = require('showdown');
showdown.setFlavor('github');

function AgendaCard(name, content, id) {
    name = "agenda " + name
    return(
            <div className="col-sm-6">
                <div className={name}>
                    {content}
                    <center>
                        <button className="btn btn-primary btn-primary-spacing" onClick={() => {window.location.href="/edit/" + id}}>Edit</button>
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
            api: agendaApi,
            failedToFetch: false,
            failMessage: "",
            buttonClicked: false,
            loading: false
        };
        this.showFetchFailedBanner = this.showFetchFailedBanner.bind(this);
        this.showNext = this.showNext.bind(this);
        this.flipLoading = this.flipLoading.bind(this);
    }

    showFetchFailedBanner(error) {
        console.log("error banner" + error)
        this.setState({
            failedToFetch: true,
            failMessage: error
        })
    }

    fetchAndShow() {
        this.flipLoading();

        fetch(this.state.api, {
            crossDomain: true,
            method: 'GET'
        })
            .then(response => {
                this.flipLoading();
                return response.json();
            })
            .then(data => this.setState({
                count: data['count'],
                previous: data['previous'],
                next: data['next'],
                agendas: data['results'],
            }))
            .catch(error => {
                this.flipLoading();
                this.showFetchFailedBanner(error.message)
            });
    }

    componentDidMount() {
        this.fetchAndShow()
    }

    showNext() {
        if(this.state.next) {
            this.setState({
                api: this.state.next,
                buttonClicked: true
            })
        }
    }

    showPrevious() {
        if(this.state.previous) {
            this.setState({
                api: this.state.previous,
                buttonClicked: true
            })
        }
    }

    flipLoading() {
        console.log("flip");
        this.setState({
            loading: !this.state.loading
        })
        console.log(this.state.loading)
    }

    render() {
        let that = this;

        if(this.state.buttonClicked) {
            this.fetchAndShow();
            this.setState({
                buttonClicked: false
            })
        }

        let cards = [];

        for (var i = 0; i < this.state.agendas.length; i++) {
            let agenda_raw = this.state.agendas[i].agenda_text ;
            let converter = new showdown.Converter();
            let agenda_html = converter.makeHtml(agenda_raw);
            let rendered_agenda = renderHTML(agenda_html);
            let name = "agenda-col-" + ((i%4)+1);
            cards.push(AgendaCard(name, rendered_agenda, this.state.agendas[i].id))
        }


        return (
            <div>
                <NavBar/>
                <div class="container">
                        {
                            this.state.loading &&
                            <Spinner loading={this.state.loading} />
                        }
                        {
                            !this.state.loading && this.state.failedToFetch &&
                            <div>
                                <center>
                                    <DangerAlert message={this.state.failMessage}/>
                                </center>
                            </div>
                        }
                        {
                            !this.state.loading && !this.state.failedToFetch &&
                            <div>
                                <center>
                                    <InfoAlert message={"Showing " + (this.state.count) + " agendas."} />
                                        {
                                            this.state.previous &&
                                            <button className="btn btn-link btn-active btn-custom" onClick={() => this.showPrevious()}>
                                                Previous
                                            </button>
                                        }

                                        {
                                            this.state.next &&
                                            <button className="btn btn-link btn-active btn-custom" onClick={() => this.showNext()}>
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
                    <Route path='/edit/:id' component={AgendaForm} />
                    <Route path='/preview' component={NewAgendaForm} />
                </div>
            </Router>
        )
    }
}

ReactDOM.render(
   <Root/>,
    document.getElementById('root')
);
