import React, { useEffect, useState } from 'react';
import { Col } from 'react-bootstrap';
import './Logout.scss';
import { GenProps } from '../../../types/generic';
import AuthService from '../../../services/authService';
import { Navigate } from 'react-router-dom';

type LogoutProps = GenProps & { logoutCallback: Function };

function Logout(props: LogoutProps) {
  // State
  const [navigate, setNavigate] = useState<string | undefined>(undefined);

  // Circumstancial
  const performLogout = async () => {
    await AuthService.logout();
    props.logoutCallback();

    setTimeout(() => setNavigate('/app'), 1000);
  };

  useEffect(() => {
    props.pageName('Logout');
    performLogout();
  }, []);

  return (
    <Col id="loginWrapper">
      {navigate && <Navigate to={navigate}/>}
      <h1 className="laptop">Logout</h1>
      <h2>Déconnexion en cours</h2>
    </Col>
  );
}

export default Logout;