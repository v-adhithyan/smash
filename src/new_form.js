import React from 'react';
import NavBar from './navbar.js';
import SplitterLayout from 'react-splitter-layout';
import renderHTML from 'react-render-html';
const rmj = require('render-markdown-js')

class NewAgendaForm extends React.Component {
  constructor(props) {
    super(props);
    let initialInput = "# Type something .."
    this.state = {
      input: "",
      placeholder: initialInput,
      preview: renderHTML(rmj(initialInput))
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let renderedMarkdown = renderHTML(rmj(value));
    this.setState({
      [name]: value,
      preview: renderedMarkdown
    });
  }

  render() {
    return(
      <div>
        <NavBar/>
        <SplitterLayout>
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
