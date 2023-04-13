import React from 'react';
import { getRandomOfList } from '../../utils';
import { Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './NotFound.scss';
import { GenProps } from '../../types/generic';

function NotFound(props: GenProps) {
  props.pageName('');

  return (
    <Col id="notFoundWrapper">
      <h1>Page introuvable {getRandomOfList(['😥', '😲', '🤯', '😠', '🥴', '😓'])}</h1>
      <Link to="/app">
        <Image alt="Maite défonce une anguille" src={`${process.env.PUBLIC_URL}/maite-anguilles.gif`}></Image>
      </Link>
    </Col>
  );
}

export default NotFound;