import React, { useEffect } from 'react';
import { Button, Col } from 'react-bootstrap';
import './Login.scss';
import { AiFillFacebook, AiFillGithub, AiFillGoogleCircle } from 'react-icons/ai';
import config from '../../../config';
import { GenProps } from '../../../types/generic';

function Login(props: GenProps) {
  useEffect(() => {
    props.pageName('Login');
  }, []);

  return (
    <Col id="loginWrapper">
      <h1 className="laptop">Login</h1>
      <a href={`${config.API_URL}/auth/github`}>
        <Button>
          Login avec Github
          <AiFillGithub />
        </Button>
      </a>
      <Button disabled>
          Login avec Google
        <AiFillGoogleCircle />
      </Button>
      <Button disabled>
        Login avec Facebook
        <AiFillFacebook />
      </Button>
    </Col>
  );
}

export default Login;