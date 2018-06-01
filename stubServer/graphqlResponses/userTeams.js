module.exports = () => ({
  data: {
    viewer: {
      organizations: {
        edges: [
          {
            node: {
              teams: {
                edges: [
                  {
                    node: { id: 'MDQ6VGVhbTExMjE4MzI=', name: 'Team: Rewards' },
                  },
                ],
              },
            },
          },
          {
            node: {
              teams: {
                edges: [
                  {
                    node: {
                      id: 'MDQ6VGVhbTIwNTY1OTc=',
                      name: 'January 2017 Cohort',
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
  },
});
