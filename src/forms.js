import React from 'react';
import NavBar from './navbar.js';
import agendaApi from './constants.js';
import {DangerAlert, SuccessAlert} from './alerts.js';
import Spinner from './spinner.js';
import renderHTML from 'react-render-html';
const showdown  = require('showdown');
showdown.setFlavor('github');

class AgendaForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form_name: 'Create Agenda',
      value: '',
      agenda_title: '',
      agenda_text: '',
      reflection: '',
      submitted: false,
      success: false,
      error: false,
      message: "Hey there, Plan your awesome work !",
      loading: false,
      id: this.props.match.params.id,
      edit: false,
      showForm: true,
      markdownPreview: "",
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

  getMarkdown(text) {
    let converter = new showdown.Converter();
    return renderHTML(converter.makeHtml(text));
  }
  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let renderedMarkdown = this.state.markdownPreview;
    if(name == "agenda_text") {
      renderedMarkdown = this.getMarkdown(value);
    }

    this.setState({
      [name]: value,
      markdownPreview: (this.state.markdownPreview != renderedMarkdown) ? renderedMarkdown : this.state.markdownPreview
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
          agenda_title: data.agenda_title,
          agenda_text: data.agenda_text,
          showForm: true,
          markdownPreview: this.getMarkdown(data.agenda_text)
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
        <div className="row">
          <div className="col-sm-4">
          </div>
          {
            this.state.showForm &&
            <div>
              <center>
                <h1>
                  {this.props.form_name || this.state.form_name}
                </h1>
              </center>
                <form onSubmit={this.handleSubmit}>
                  {/*
                  <div>
                    <label>
                      Title:
                      <input
                        type="text"
                        className="form-control input-lg"
                        name="agenda_title"
                        placeholder="title"
                        value={this.state.agenda_title}
                        onChange={this.handleChange} />
                    </label>
                  </div>
                  */}
                  <div >
                    <label>
                      Agenda:
                      <textarea
                        type="text"
                        className="form-control input-lg"
                        name="agenda_text"
                        placeholder="todo"
                        value={this.state.agenda_text}
                        onChange={this.handleChange}
                        rows="10" />
                    </label>
                  </div>
                  {/*
                  <div>
                    <label>
                      Reflection:
                      <textarea
                        type="text"
                        className="form-control input-lg"
                        name="reflection"
                        placeholder="reflection"
                        value={this.state.reflection}
                        onChange={this.handleChange}
                        disabled={true} />
                    </label>
                  </div>
                  */}
                  <center></center>
                  <button
                    type="submit"
                    className="btn btn-primary btn-custom">Submit</button>
                    <button
                      type="button"
                      class="btn btn-info btn-custom"
                      data-toggle="modal"
                      data-target="#myModal">Preview</button>
                </form>
                <div>
                  
                </div>
              <div
                id="myModal"
                class="modal fade"
                role="dialog">
                <div class="modal-dialog">

                  <div class="modal-content">
                    <div class="modal-header">
                      <button
                        type="button"
                        class="close"
                        data-dismiss="modal">&times;</button>
                      <h4 class="modal-title">Preview</h4>
                    </div>
                    <div class="modal-body">
                        {this.state.markdownPreview}
                    </div>
                    <div class="modal-footer">
                      <button
                        type="button"
                        class="btn btn-default"
                        data-dismiss="modal">Close</button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          }
          <div className="col-sm-4">
          </div>
        </div>
      </div>
    );
  }
}

export default AgendaForm;
