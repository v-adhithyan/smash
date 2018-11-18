import React, { Component } from 'react';
import renderHTML from 'react-render-html';

//const API = 'https://poydev.pythonanywhere.com/api/v1/agenda/';
const API = "http://localhost:8000/api/v1/agenda/"
const rmj = require('render-markdown-js')

class App extends Component {
  constructor(props) {
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
  }

  render() {
    //const agenda  = this.state.agenda;
    let agenda_raw = "";
    console.log(this.state.agendas);
    for(var i=0; i<this.state.agendas.length; i++) {
      agenda_raw += this.state.agendas[i].agenda_text + "\n";
    }
    const agenda_html = rmj(agenda_raw)
    return (
      <div className='app'>
        {renderHTML(agenda_html)}
      </div>
    )
  }
}
export default App;