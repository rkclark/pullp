export default function normalizeGraphqlEdges({ edges }) {
  if (!edges) {
    throw new Error('Must supply a GraphQL result object with a key "edges"');
  }

  if (!Array.isArray(edges)) {
    throw new Error('"edges" must be an array');
  }

  const result = edges.map(edge => {
    if (!Object.keys(edge).includes('node')) {
      throw new Error(
        'Edges array cannot be normalized - must be an array of objects with key of "node"',
      );
    }

    const { node } = edge;

    if (!node) {
      /* eslint-disable no-console */
      console.warn('Attempted to normalize a node with value:', node);
      /* eslint-enable no-console */
    }
    return node;
  });

  return result.filter(node => node);
}
