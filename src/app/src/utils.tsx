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

function debounce(func: Function, context: any, timeout = 300){
  let timer: NodeJS.Timeout;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(context, args); }, timeout);
  };
}

export { getRandomOfList, withParams, debounce };