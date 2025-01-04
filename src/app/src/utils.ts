import { useEffect, useMemo, useRef } from 'react';
import config from './config';

function getRandomOfList (list: Array<string>): string {
  return list[Math.floor((Math.random()*list.length))];
}

const debounce = (func: Function, timeout = 300): Function => {
  let timer: number;
  return (...args: any) => {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(context, args); }, timeout);
  };
};

function useDebounce(callback: Function) {
  const ref = useRef(undefined);

  useEffect(() => {
    // @ts-ignore
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = (...args: any[]) => {
      // @ts-ignore
      ref.current?.(...args);
    };

    return debounce(func, 500);
  }, []);

  return debouncedCallback;
}

const useHasChanged= (value: any) => {
  const previousValue = usePrevious(value);
  return previousValue !== value;
};

const usePrevious = (value: any) => {
  const ref = useRef(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

function getRecipeImg(recipeId: string | undefined, hasImg: boolean): string {
  return hasImg && recipeId !== undefined ?
    `${config.API_URL}/static/img/${recipeId}.jpg` : `${import.meta.env.BASE_URL}placeholder.jpg`;
}

export { getRandomOfList, debounce, useDebounce, useHasChanged, getRecipeImg };