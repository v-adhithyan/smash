import React from 'react';
import NavBar from './navbar.js';
import agendaApi from './constants.js';
import {DangerAlert, SuccessAlert} from './alerts.js';
import Spinner from './spinner.js';
import SplitterLayout from 'react-splitter-layout';
import renderHTML from 'react-render-html';
import FloatGroup from 'react-float-button';
const rmj = require('render-markdown-js');
const showdown  = require('showdown');
showdown.setFlavor('github');

class AgendaForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form_name: 'Create Agenda',
      value: '',
      agenda_title: 'New Agenda',
      agenda_text: '',
      reflection: '',
      submitted: false,
      success: false,
      error: false,
      message: "Hey there, Plan your awesome work !",
      placeholder: "What do you want to note now ?",
      preview: renderHTML(rmj("### Type on left side. This is the preview pane.")),
      loading: false,
      id: this.props.match.params.id,
      edit: false,
      showForm: true
    }

    let isEdit = window.location.pathname.indexOf("edit") > 0;
    if(isEdit) {
      this.state.edit = true;
      this.state.form_name = "Edit Agenda";
      this.state.showForm = false;
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.flipLoading = this.flipLoading.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let converter = new showdown.Converter();
    let renderedMarkdown = renderHTML(converter.makeHtml(value));
    let newTitle = value.split("\n")[0];
    if(newTitle) {
      newTitle = newTitle.replace("#", "");
    }
    this.setState({
      [name]: value,
      preview: renderedMarkdown,
      agenda_title: (newTitle != this.state.agenda_title) ? newTitle: this.state.agenda_title
    });
  }

  setDefaults() {
    this.setState({
      success: false,
      error: false
    })
  }

  setSuccess(message) {
    this.setState({
      success: true,
      message: message
    })
  }

  setFail(message) {
    this.setState({
      error: true,
      message: message
    })
  }

  flipLoading() {
    this.setState({
      loading: !this.state.loading
    })
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setDefaults()
    this.flipLoading();
    const that = this;

    let api = agendaApi;
    let httpMethod = "post";

    if(this.state.edit) {
      api += this.state.id + "/";
      httpMethod = "PUT";
    }

    let data = {
      agenda_title: this.state.agenda_title,
      agenda_text: this.state.agenda_text,
      reflection: ""
    }
    fetch(api, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: httpMethod,
      body: JSON.stringify(data)
    }).then(response => {
      this.flipLoading();
      if(response.status === 200 || response.status === 201) {
        that.setSuccess("Successfully created agenda");
      } else {
        that.setFail("Failed to create agenda");
      }
    }).then(data => {})
    .catch(error => {
      this.flipLoading();
      that.setFail(error.message)
    } )
  }

  componentDidMount() {
    if(this.state.edit) {
      this.flipLoading();
      let api = agendaApi + this.state.id;
      fetch(api, {
        method: 'GET'
      }).then(response => {
        this.flipLoading();
        if(response.status === 200) {
          return response.json();
        } else {
          this.setFail("Failed to get agenda from server. Please try again!")
        }
      }).then(data => {
        this.setState({
          agenda_title: data.agenda_text.split("\n")[0].replace("#", ""),
          agenda_text: data.agenda_text,
          preview: renderHTML(rmj(data.agenda_text)),
          showForm: true,
        })
      })
      .catch(error => {
        if(this.state.loading) { this.flipLoading(); }
        this.setFail(error)
      })
    }
  }

  render() {
    return (
      <div>
        <NavBar/>
        <center>
          {
            this.state.loading &&
            <Spinner loading={this.state.loading} />
          }
          {
            this.state.success ?
            <SuccessAlert message={this.state.message} />
            :
            <div>
            </div>
          }

          {
            this.state.error ?
            <DangerAlert message={this.state.message} />
            :
            <div>
            </div>
          }
        </center>

        {
          this.state.showForm &&
          <div>
            <center>
              <h1>
                {this.state.agenda_title}
              </h1>
            </center>
            <SplitterLayout percentage={true}>
              <div>
                <form onSubmit={this.handleSubmit}>
                  <textarea
                    autofocus
                    type="text"
                    name="agenda_text"
                    placeholder={this.state.placeholder}
                    value={this.state.agenda_text}
                    onChange={this.handleChange}
                    />
                </form>
              </div>
              <div class="preview">
                {this.state.preview}
              </div>
            </SplitterLayout>
          </div>
        }

      </div>
    );
  }
}

export default AgendaForm;
