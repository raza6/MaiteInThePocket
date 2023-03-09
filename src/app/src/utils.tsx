import React, { useEffect, useMemo, useRef } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';

function withRouter(Component: unknown): Function {
  // @ts-ignore
  // eslint-disable-next-line react/display-name
  return (props: unknown) => <Component {...props}
    router={{
      params: useParams(), 
      searchParams: useSearchParams()[0],
      location: useLocation()
    }}
  />;
}

function getRandomOfList (list: Array<string>): string {
  return list[Math.floor((Math.random()*list.length))];
}

const debounce = (func: Function, timeout = 300): Function => {
  let timer: NodeJS.Timeout;
  return (...args: any) => {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(context, args); }, timeout);
  };
};

function useDebounce(callback: Function) {
  const ref = useRef();

  useEffect(() => {
    // @ts-ignore
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      // @ts-ignore
      ref.current?.();
    };

    return debounce(func, 300);
  }, []);

  return debouncedCallback;
}

function getRecipeImg(recipeId: string | undefined, hasImg: boolean): string {
  return hasImg && recipeId !== undefined ?
    `http://maite.raza6.fr/mp/static/img/${recipeId}.jpg` :
    process.env.PUBLIC_URL + '/placeholder.jpg';
}

export { getRandomOfList, withRouter, debounce, useDebounce, getRecipeImg };