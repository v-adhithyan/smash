import React from 'react';
import NavBar from './navbar.js';
import SplitterLayout from 'react-splitter-layout';
import renderHTML from 'react-render-html';
const rmj = require('render-markdown-js')

class NewAgendaForm extends React.Component {
  constructor(props) {
    super(props);
    let initialInput = "### You can view the markdown preview here."
    this.state = {
      input: "",
      placeholder: "Type your note here",
      title: "New note",
      preview: renderHTML(rmj(initialInput))
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let renderedMarkdown = renderHTML(rmj(value));
    let newTitle = value.split("\n")[0];
    if(newTitle) {
      newTitle = newTitle.replace("#", "");
    }
    
    this.setState({
      [name]: value,
      preview: renderedMarkdown,
      title: (newTitle != this.state.title) ? newTitle : this.state.title
    });
  }

  render() {
    return(
      <div>
        <NavBar/>
        <center><h1>{this.state.title}</h1></center>
        <SplitterLayout percentage={true}>
          <div>
            <form>
              <textarea
              type="text"
              name="input"
              placeholder={this.state.placeholder}
              value={this.state.input}
              onChange={this.handleChange}
              />
            </form>
          </div>
          <div>
            {this.state.preview}
          </div>
        </SplitterLayout>
      </div>
    )
  }
}

export default NewAgendaForm;
