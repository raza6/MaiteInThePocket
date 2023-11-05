import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { Button, Col, Image } from 'react-bootstrap';
import './Settings.scss';
import { GenProps } from '../../types/generic';
import { User, EAuthOrigin } from '../../types/user';
import AuthContext from '../../components/AuthContext';
import AuthService from '../../services/authService';
import { FiLock } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function Settings(props: GenProps) {
  // State
  const [user, setUser] = useState<User | undefined>(undefined);

  // Circumstancial
  const loggedIn = useContext(AuthContext);

  const initUser = async () => {
    const authResult = await AuthService.checkAuth();
    if (authResult.success) {
      setUser(authResult.user);
    }
  };

  useEffect(() => {
    initUser();
    props.pageName('Paramètres');
  }, []);

  const renderOrigin = (origin: EAuthOrigin | undefined): ReactNode => {
    switch(origin) {
    case EAuthOrigin.Github:
      return 'Github';
    default:
      return 'service inconnu';
    }
  };

  return (
    <Col id="settingsWrapper">
      <h1>Paramètres</h1>
      {
        loggedIn ?
          <div id="infoWrapper">
            <div id="userWrapper">
              <Image alt="Photo de l'utilisateur" src={user?.avatar}></Image>
              <h2>Salut {user?.name} 😀</h2>
            </div>
            <div id="loginStatus">
              <span>Tu es connecté via {renderOrigin(user?.origin)}</span>
              <Link to="/app/logout" className="d-flex flex-column align-items-center">
                <Button>
                  Se déconnecter
                  <FiLock/>
                </Button>
              </Link>
            </div>
          </div> :
          <h2>Vous êtes en mode lecture seule</h2>
      }
    </Col>
  );
}

export default Settings;