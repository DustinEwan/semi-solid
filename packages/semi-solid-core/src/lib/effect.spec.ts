import { createSignalEffect } from './effect';
import { createSignal } from './signal';

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
});
