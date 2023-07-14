import { Effect, getCurrentEffect } from './effect';

export type GetSignal<T> = () => T;
export type SetSignal<T> = (value: T) => void;

export type Signal<T> = [GetSignal<T>, SetSignal<T>];

export const createSignal = <T>(initialValue: T): Signal<T> => {
  let value = structuredClone(initialValue);

  let observers: [() => boolean, Effect][] = [];
  const getSignal = () => {
    const currentEffect = getCurrentEffect();
    if (
      currentEffect &&
      !observers.find(
        ([isActive, fn]) => isActive() && fn === currentEffect![1]
      )
    ) {
      observers.push(currentEffect);
    }

    return value;
  };

  return [
    getSignal,
    (newValue: T) => {
      value = structuredClone(newValue);

      observers = observers.filter(([isActive]) => {
        const yup = isActive();
        return yup;
      });

      observers.forEach(([, fn]) => {
        fn();
      });
    },
  ];
};
