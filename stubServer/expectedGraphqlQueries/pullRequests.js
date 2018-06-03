module.exports = (ids, maximumPrs) => ({
  query: `
    query {
      nodes (ids:${JSON.stringify(ids)}) {
        id
        ... on Repository {
          pullRequests(last: ${maximumPrs} states: [OPEN] orderBy:{ field: CREATED_AT, direction: DESC }) {
            totalCount
            edges {
              node {
                createdAt
                url
                number
                title
                author {
                  avatarUrl
                  login
                  url
                }
                reviewRequests(last: 100) {
                  edges {
                    node {
                      requestedReviewer {
                        ... on User {
                          login
                          avatarUrl
                        }
                        ... on Team {
                          name
                          id
                          avatarUrl
                        }
                      }
                    }
                  }
                }
                reviews(last: 100) {
                  edges {
                    node {
                      author {
                        login
                        avatarUrl
                      }
                      createdAt
                      state
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    `,
});
