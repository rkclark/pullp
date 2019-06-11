import normalizeGraphqlEdges from './normalizeGraphqlEdges';
/* eslint-disable no-console */

describe('normalizeGraphqlEdges()', () => {
  describe('when no arg is provided', () => {
    it('throws an error', () => {
      expect(() => {
        normalizeGraphqlEdges();
      }).toThrow(TypeError);
    });
  });

  describe('when provided arg is not an object with a key of "edges"', () => {
    describe('when arg is an empty object', () => {
      it('throws an error', () => {
        expect(() => {
          normalizeGraphqlEdges({});
        }).toThrow('Must supply a GraphQL result object with a key "edges"');
      });
    });

    describe('when arg is a string', () => {
      it('throws an error', () => {
        expect(() => {
          normalizeGraphqlEdges('string');
        }).toThrow('Must supply a GraphQL result object with a key "edges"');
      });
    });
  });

  describe('when edges is not an array', () => {
    describe('when edges is a string', () => {
      it('throws an error', () => {
        expect(() => {
          normalizeGraphqlEdges({ edges: 'string' });
        }).toThrow('"edges" must be an array');
      });
    });

    describe('when edges is an object', () => {
      it('throws an error', () => {
        expect(() => {
          normalizeGraphqlEdges({ edges: {} });
        }).toThrow('"edges" must be an array');
      });
    });
  });

  describe('when edges is not an array of objects', () => {
    it('throws an error', () => {
      expect(() => {
        normalizeGraphqlEdges({ edges: [1, 2, 3] });
      }).toThrow(
        'Edges array cannot be normalized - must be an array of objects with key of "node"',
      );
    });
  });

  describe('when an edges contains an object without the key "node"', () => {
    it('throws an error', () => {
      expect(() => {
        normalizeGraphqlEdges({ edges: [{}] });
      }).toThrow(
        'Edges array cannot be normalized - must be an array of objects with key of "node"',
      );
    });
  });

  describe('when edges is valid', () => {
    it('returns an array containing the value of "node" from each edge item', () => {
      const resultOne = { id: 1 };
      const resultTwo = { id: 2 };
      const expectedResult = [resultOne, resultTwo];

      const actualResult = normalizeGraphqlEdges({
        edges: [{ node: resultOne }, { node: resultTwo }],
      });

      expect(expectedResult).toEqual(actualResult);
    });
  });

  describe('when a node is falsy', () => {
    it('filters the node from the returned array', () => {
      const originalConsoleWarn = console.warn;
      console.warn = () => {};
      const nodeOne = { id: 1 };
      const expectedResult = [nodeOne];

      const actualResult = normalizeGraphqlEdges({
        edges: [{ node: nodeOne }, { node: null }],
      });
      console.warn = originalConsoleWarn;

      expect(expectedResult).toEqual(actualResult);
    });
  });
});
