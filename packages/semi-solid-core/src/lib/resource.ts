import { createSignalEffect } from './effect';
import { Signal, createSignal } from './signal';

export type ResourceStates = 'pending' | 'ready' | 'refreshing' | 'error';
export type ResourceSignal<U> = {
  (): U;
  state: ResourceStates;
  loading: boolean;
  error: unknown | undefined;
};

export type Resource<U> = [
  ResourceSignal<U>,
  { mutate: (data: U) => void; refetch: () => void }
];

export type ResourceFetchFn<T, U> = (input: T) => Promise<U>;
export function createResource<T, U>(
  sourceSignal: Signal<T>,
  fetchData: ResourceFetchFn<T, U>
): Resource<U>;
export function createResource<T, U>(
  fetchData: ResourceFetchFn<T, U>,
  unused: never
): Resource<U>;

export function createResource<T, U>(
  a: Signal<T> | ResourceFetchFn<T, U>,
  b: ResourceFetchFn<T, U> | never
): Resource<U | undefined> {
  let fetchFn: ResourceFetchFn<T, U>;
  let previousInput: T;
  let hasResolved = false;

  const [value, setValue] = createSignal<U | undefined>(undefined);
  const [error, setError] = createSignal<unknown>(undefined);
  const [state, setState] = createSignal<ResourceStates>('pending');

  const result = () => value();
  Object.defineProperties(result, {
    state: { get: () => state() },
    error: { get: () => error() },
    loading: {
      get() {
        const s = state();
        return s === 'pending' || s === 'refreshing';
      },
    },
  });

  const handleFetch = async (input: T) => {
    previousInput = input;
    if (hasResolved) {
      setState('refreshing');
    }
    setError(undefined);
    try {
      const valueResult = await fetchFn(input);
      setValue(valueResult);
      setState('ready');
    } catch (error) {
      setState('error');
      setError(error);
    } finally {
      hasResolved = true;
    }
  };

  if (Array.isArray(a)) {
    const signal = a;

    if (!b) {
      throw new Error('Resource initialized without a fetch function.');
    }
    fetchFn = b;

    const [getInputValue] = signal;

    createSignalEffect(() => {
      const input = getInputValue();
      void handleFetch(input);
    });
  } else {
    fetchFn = a;
  }

  const refetch = () => handleFetch(previousInput);

  return [result as ResourceSignal<U>, { mutate: setValue, refetch }];
}
