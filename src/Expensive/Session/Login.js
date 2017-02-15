import React from "react";
import Modal from "Expensive/Session/Login/Modal";
import {authentication} from "Expensive/authentication";

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.state = {email: "", password: "", status: "normal"};
  }

  handleSubmit() {
    event.preventDefault();
    if(this.state.status == "loading")
      return;

    this.setState({ status: "loading" });

    authentication
      .attemptLogin(this.state.email, this.state.password)
      .then(() => this.props.router.push("/"))
      .fail(() => this.setState({ status: "error" }));
  }

  handleUpdate(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    return (
      <div className="action-login">
        <div className="user-login-background"></div>,
        <section className="contents outer-container">
          <Modal
            status={this.state.status}
            onSubmit={this.handleSubmit}
            onUpdate={this.handleUpdate}
          />
        </section>
      </div>
    );
  }
}

Login.propTypes = {
  router: React.PropTypes.object.isRequired,
}
