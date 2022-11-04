import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

function withParams(Component: unknown): Function {
  // @ts-ignore
  // eslint-disable-next-line react/display-name
  return (props: unknown) => <Component {...props} params={useParams()} searchParams={useSearchParams()[0]} />;
}

function getRandomOfList (list: Array<string>): string {
  return list[Math.floor((Math.random()*list.length))];
}

function debounce(func: Function, context: any, timeout = 300): Function {
  let timer: NodeJS.Timeout;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(context, args); }, timeout);
  };
}

function getRecipeImg(recipeId: string | undefined, hasImg: boolean): string {
  return hasImg && recipeId !== undefined ?
    `http://maite.raza6.fr/mp/static/img/${recipeId}.jpg` :
    process.env.PUBLIC_URL + '/placeholder.jpg';
}

export { getRandomOfList, withParams, debounce, getRecipeImg };