import React from 'react';
import { Button, Col } from 'react-bootstrap';
import './Login.scss';
import { AiFillGithub } from 'react-icons/ai';
import AuthService from '../../../services/authService';
import config from '../../../config';
import { GenProps } from '../../../types/generic';

function Login(props: GenProps) {
  props.pageName('Login');
  
  const checkAuth = async (): Promise<void> => {
    await AuthService.checkAuth();
  };

  return (
    <Col id="loginWrapper">
      <h1 className="laptop">Login</h1>
      <a href={`${config.API_URL}/auth/github`}>
        <Button>
          Login avec Github
          <AiFillGithub />
        </Button>
      </a>
      <Button onClick={checkAuth}>
        Check
      </Button>
    </Col>
  );
}

export default Login;