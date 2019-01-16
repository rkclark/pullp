import normalizeGraphqlEdges from '../../utils/normalizeGraphqlEdges';

const dateOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

const timeOptions = {
  hour: 'numeric',
  minute: 'numeric',
};

export default function transformPullRequests(pullRequests) {
  return pullRequests.edges.map(({ node }) => {
    const createdAtDate = new Date(node.createdAt);
    const reviews = normalizeGraphqlEdges(node.reviews);

    return {
      date: createdAtDate.toLocaleDateString('en-GB', dateOptions),
      time: createdAtDate.toLocaleTimeString('en-US', timeOptions),
      reviews,
    };
  });
}
