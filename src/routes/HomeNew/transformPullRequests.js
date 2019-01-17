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

const aggregateReviewsByAuthor = reviews => {
  let reviewsByAuthor = [];
  if (reviews.length > 0) {
    reviewsByAuthor = reviews.reduce((arr, review) => {
      const existingIndex = arr.findIndex(authorReview => {
        if (authorReview.login === review.author.login) {
          return true;
        }
        return false;
      });

      if (existingIndex > -1) {
        arr[existingIndex].states.push(review.state);
        return [...arr];
      }

      return [
        ...arr,
        {
          login: review.author.login,
          avatarUrl: review.author.avatarUrl,
          states: [review.state],
        },
      ];
    }, []);
  }
  return reviewsByAuthor;
};

export default function transformPullRequests(pullRequests) {
  return pullRequests.edges.map(({ node }) => {
    const createdAtDate = new Date(node.createdAt);
    const reviews = normalizeGraphqlEdges(node.reviews);
    const reviewRequests = normalizeGraphqlEdges(node.reviewRequests);
    const reviewsByAuthor = aggregateReviewsByAuthor(reviews);

    return {
      date: createdAtDate.toLocaleDateString('en-GB', dateOptions),
      time: createdAtDate.toLocaleTimeString('en-US', timeOptions),
      reviews,
      reviewRequests,
      reviewsByAuthor,
    };
  });
}
