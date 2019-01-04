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

    return {
      date: createdAtDate.toLocaleDateString('en-GB', dateOptions),
      time: createdAtDate.toLocaleTimeString('en-US', timeOptions),
    };
  });
}
