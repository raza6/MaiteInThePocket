import React from 'react';
import { useParams } from 'react-router-dom';

function withParams(Component: unknown) {
  // @ts-ignore
  // eslint-disable-next-line react/display-name
  return (props: unknown) => <Component {...props} params={useParams()} />;
}

function getRandomOfList (list: Array<string>) {
  return list[Math.floor((Math.random()*list.length))];
}

export { getRandomOfList, withParams };