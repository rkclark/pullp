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

export default function reformatPullRequests(pullRequests) {
  const formattedPullRequests = pullRequests.map(({ node }) => {
    const createdAtDate = new Date(node.createdAt);

    return {
      ...node,
      date: createdAtDate.toLocaleDateString('en-GB', dateOptions),
      time: createdAtDate.toLocaleTimeString('en-US', timeOptions),
    };
  });

  return formattedPullRequests;
}
