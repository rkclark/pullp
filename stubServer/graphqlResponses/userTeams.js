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
                    node: { id: 'MDQ6VGVhbTExMjE4MzI=', name: 'Team Awesome' },
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
