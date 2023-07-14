import { useEffect, useReducer } from 'react';
import {
  Signal,
  createSignal,
  Effect,
  createSignalEffect,
  Resource,
} from 'semi-solid-core';

const useForceRender = () => {
  const [, render] = useReducer((x: number) => x + 1, 0);
  return render;
};

export const useSignal = <T>(signal: Signal<T>): Signal<T> => {
  const render = useForceRender();
  const [getValue] = signal;

  useSignalEffect(() => {
    getValue();
    render();
  });

  return signal;
};

export const buildUseSignal = <T>(initialValue: T) => {
  const signal = createSignal(initialValue);

  return () => useSignal(signal);
};

export const useSignalEffect = (fn: Effect) => {
  useEffect(() => {
    let isActive = true;
    createSignalEffect(fn, () => isActive);
    return () => {
      isActive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export const useResource = <U>(resource: Resource<U>) => {
  const render = useForceRender();

  const [value] = resource;

  useSignalEffect(() => {
    value();
    value.state;
    render();
  });

  return resource;
};
