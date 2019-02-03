export default function normalizeGraphqlEdges({ edges }) {
  if (!edges) {
    throw new Error('Must supply a GraphQL result object with a key "edges"');
  }

  if (!Array.isArray(edges)) {
    throw new Error('"edges" must be an array');
  }

  const result = edges.map(({ node }) => {
    if (!node) {
      throw new Error(
        'Edges array cannot be normalized - must be an array of objects with key of "node"',
      );
    }
    return node;
  });

  return result;
}
