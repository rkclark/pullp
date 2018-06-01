module.exports = userLogin => ({
  query: `
  query {
    viewer {
      organizations(last:100) {
        edges {
          node {
            teams(last:100, userLogins: ["${userLogin}"]) {
              edges {
                node {
                  id
                  name
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
