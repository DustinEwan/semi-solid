import { createSignalEffect } from './effect';
import { ResourceSignal, createResource } from './resource';
import { createSignal } from './signal';

async function waitUntilFinishedLoading(resource: ResourceSignal<unknown>) {
  return new Promise((resolve) => {
    const handle = setInterval(() => {
      if (!resource.loading) {
        clearInterval(handle);
        resolve(null);
      }
    }, 200);
  });
}

describe('effects', () => {
  it('should execute properly when signal updates', () => {
    const [signal, setSignal] = createSignal({ foo: 'bar' });
    let effectValue = '';

    createSignalEffect(() => {
      effectValue = signal().foo;
    });

    setSignal({ foo: 'baz' });

    expect(effectValue).toEqual('baz');
  });

  it('should not execute when signal attempts to update with same value', () => {
    const [signal, setSignal] = createSignal(5);
    let effectValue = 0;

    createSignalEffect(() => {
      effectValue = effectValue + signal();
    });

    setSignal(5);

    expect(effectValue).toEqual(5);
  });

  it('should execute when effect is monitoring a computed value', () => {
    const [signal, setSignal] = createSignal(5);
    let effectValue = 0;

    const double = () => signal() * 2;

    createSignalEffect(() => {
      effectValue = double();
    });

    setSignal(6);

    expect(effectValue).toEqual(12);
  });

  it('should execute when effect is monitoring a resource', async () => {
    const source = createSignal('Bob');
    const [, setSignal] = source;
    let effectValue = 0;

    const [nameLength] = createResource(source, (value: string) =>
      Promise.resolve(value.length)
    );

    createSignalEffect(() => {
      effectValue = `The secret person's name is ${nameLength()} characters long`;
    });

    setSignal('Alice');

    await waitUntilFinishedLoading(nameLength);

    expect(effectValue).toEqual(
      `The secret person's name is 5 characters long`
    );
  });
});
