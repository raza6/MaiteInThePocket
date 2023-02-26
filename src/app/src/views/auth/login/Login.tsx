import React, { Component } from 'react';
import { Button, Col } from 'react-bootstrap';
import './Login.scss';
import { AiFillGithub } from 'react-icons/ai';
import AuthService from '../../../services/authService';
import config from '../../../config';

class Login extends Component {
  constructor(props: {}) {
    super(props);

    this.checkAuth = this.checkAuth.bind(this);
  }

  async checkAuth(): Promise<void> {
    await AuthService.checkAuth();
  }

  render() {
    return (
      <Col id="loginWrapper">
        <h1>Login</h1>
        <a href={`${config.API_URL}/auth/github`}>
          <Button>
            Login avec Github
            <AiFillGithub />
          </Button>
        </a>
        <Button onClick={this.checkAuth}>
          Check
        </Button>
      </Col>
    );
  }
}

export default Login;