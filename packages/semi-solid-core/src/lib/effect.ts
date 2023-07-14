export type Effect = () => void;

let currentEffect: [() => boolean, Effect] | null = null;
export const getCurrentEffect = () => currentEffect;

export const createSignalEffect = (
  fn: Effect,
  activeFn: () => boolean = () => true
) => {
  function effect() {
    currentEffect = [activeFn, effect];
    fn();
    currentEffect = null;
  }

  effect();
};
