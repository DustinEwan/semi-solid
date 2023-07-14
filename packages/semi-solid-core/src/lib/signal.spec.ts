import { createSignal } from './signal';

describe('signals', () => {
  it('should update properly when tracking objects', () => {
    const [signal, setSignal] = createSignal({ foo: 'bar' });

    expect(signal().foo).toEqual('bar');

    setSignal({ foo: 'baz' });

    expect(signal().foo).toEqual('baz');
  });
});
