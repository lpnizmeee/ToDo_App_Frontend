import React, { Component } from "react";
import "./App.css";
import CustomModal from "./components/Modal";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      viewCompleted: false,
      activeItem: {
        title: "",
        description: "",
        completed: false,
      },
      taskList: [],
    };
  }

  componentDidMount() {
    this.refreshList();
  }

  //to refresh the list
  refreshList = () => {
    axios
      .get(`${process.env.BACKEND_URL}/api/tasks/`)
      .then((res) => this.setState({ taskList: res.data }))
      .catch((err) => console.log(err));
  };

  //to toggle the modal
  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  //to handle the submit button
  handleSubmit = (item) => {
    this.toggle();
    if (item.id) {
      axios
        .put(`${process.env.BACKEND_URL}/api/tasks/${item.id}/`, item)
        .then((res) => this.refreshList());
      return;
    }
    axios
      .post(`${process.env.BACKEND_URL}/api/tasks/`, item)
      .then((res) => this.refreshList());
  };

  //to handle the delete button
  handleDelete = (item) => {
    axios
      .delete(`${process.env.BACKEND_URL}/api/tasks/${item.id}/`)
      .then((res) => this.refreshList());
    return;
  };

  createItem = () => {
    const item = { title: "", modal: !this.state.modal };
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  //to handle the edit button
  editItem = (item) => {
    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  displayCompleted = (status) => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }
    return this.setState({ viewCompleted: false });
  };

  renderTabList = () => {
    return (
      <div className="my-5 tab-list">
        <span
          onClick={() => this.displayCompleted(true)}
          className={`text-black ${
            this.state.viewCompleted ? "activeCom" : ""
          }`}
        >
          Completed
        </span>
        <span
          onClick={() => this.displayCompleted(false)}
          className={`text-black ${this.state.viewCompleted ? "" : "activeIn"}`}
        >
          Incompleted
        </span>
      </div>
    );
  };

  //rendering items in the list (completed || incompleted)
  renderItems = (editItem, handleDelete) => {
    const { viewCompleted } = this.state;
    const newItems = this.state.taskList.filter(
      (item) => item.completed === viewCompleted
    );
    return newItems.map((item) => (
      <li
        key={item.id}
        className="list-group-item d-flex justify-content-between align-items-center"
      >
        <span
          className={`todo-title mr-2 ${
            this.state.viewCompleted ? "completed-todo" : ""
          }`}
          title={item.title}
        >
          {item.title}
        </span>
        <span>
          <button
            className="btn btn-info marg-right-5"
            onClick={() => {
              this.setState({ activeItem: item, modal: !this.state.modal });
            }}
          >
            Edit
          </button>
          <button
            className="btn btn-danger marg-right-5"
            onClick={() => {
              axios
                .delete(`http://localhost:8000/api/tasks/${item.id}/`)
                .then((res) => this.refreshList());
              return;
            }}
          >
            Delete
          </button>
        </span>
      </li>
    ));
  };

  render() {
    return (
      <main className="content p-3 mb-2 bg-dark bg-gradient">
        <h1 className="text-white text-uppercase text-center my-4">
          Task manager
        </h1>
        <div className="row ">
          <div className="col-md-6 col-sma-10 mx-auto p-0">
            <div className="card p-3">
              <div className="">
                <button className="btn btn-primary" onClick={this.createItem}>
                  Add task
                </button>
              </div>
              {this.renderTabList()}
              <ul className="list-group list-group-flush">
                {this.renderItems(this.editItem, this.handleDelete)}
              </ul>
            </div>
          </div>
        </div>
        <footer className="my-5 mb-2 text-white text-center">
          CopyRight &copy; LePhuongNam gPBL 2023
        </footer>
        {this.state.modal ? (
          <CustomModal
            activeItem={this.state.activeItem}
            toggle={this.toggle}
            onSave={this.handleSubmit}
          />
        ) : null}
      </main>
    );
  }
}
export default App;
