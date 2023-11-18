import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import './Login.scss';
import { AiFillFacebook, AiFillGithub, AiFillGoogleCircle } from 'react-icons/ai';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../../components/AuthContext';
import config from '../../../config';
import { GenProps } from '../../../types/generic';

function Login(props: GenProps) {
  // State
  const [navigate, setNavigate] = useState<string | undefined>(undefined);

  // Context
  const loggedIn = useContext(AuthContext);

  useEffect(() => {
    props.pageName('Login');
  }, []);

  useEffect(() => {
    if (loggedIn) {
      setNavigate('/app');
    }
  }, [loggedIn]);

  return (
    <Col id="loginWrapper">
      {navigate && <Navigate to={navigate}/>}
      <h1 className="laptop">Login</h1>
      <Row id="loginButtonWrapper">
        <a href={`${config.API_URL}/auth/github`}>
          <Button>
            Login avec Github
            <AiFillGithub />
          </Button>
        </a>
        <a>
          <Button disabled>
              Login avec Google
            <AiFillGoogleCircle />
          </Button>
        </a>
        <a>
          <Button disabled>
            Login avec Facebook
            <AiFillFacebook />
          </Button>
        </a>
      </Row>
    </Col>
  );
}

export default Login;