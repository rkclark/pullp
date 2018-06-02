module.exports = (cursor = '') => {
  const afterParam = cursor ? `, after:"${cursor}"` : '';
  return {
    query: `
        query { 
          viewer { 
            watching(first:100, affiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER]${afterParam}) {
              totalCount
              pageInfo {
                hasNextPage
              }
              edges {
                cursor
                node {
                  name
                  id
                  url
                  owner {
                    login
                    avatarUrl
                  }
                  isFork
                  createdAt
                }
              }
            }
          }
        }`,
  };
};
