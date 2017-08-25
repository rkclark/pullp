import localStore from './localStore';

let localStorage;
describe('localStore', () => {
  describe('insert', () => {
    it('saves each key value pair in obj argument to localStorage', () => {
      testObj = { foo: 'bar', bar: 'foo' };
      localStore.insert(testObj);
    });
  });
});
