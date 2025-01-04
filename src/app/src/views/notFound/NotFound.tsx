import React, { useEffect } from 'react';
import { getRandomOfList } from '../../utils';
import { Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './NotFound.scss';
import { GenProps } from '../../types/generic';

function NotFound(props: GenProps) {
  useEffect(() => {
    props.pageName('');
  }, []);

  return (
    <Col id="notFoundWrapper">
      <h1>Page introuvable {getRandomOfList(['😥', '😲', '🤯', '😠', '🥴', '😓'])}</h1>
      <Link to="/app">
        <Image alt="Maite défonce une anguille" src="/maite-anguilles.gif"></Image>
      </Link>
    </Col>
  );
}

export default NotFound;