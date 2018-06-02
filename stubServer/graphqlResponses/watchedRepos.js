module.exports = () => ({
  data: {
    viewer: {
      watching: {
        totalCount: 5,
        pageInfo: { hasNextPage: false },
        edges: [
          {
            cursor: 'Y3Vyc29yOnYyOpHOBO87/g==',
            node: {
              name: 'repo 1',
              id: 'repo1',
              url: 'https://github.com/repo1',
              owner: {
                login: 'dev',
                avatarUrl: 'https://avatars2.githubusercontent.com/dev',
              },
              isFork: true,
              createdAt: '2017-02-22T09:41:23Z',
            },
          },
          {
            cursor: 'Y3Vyc29yOnYyOpHOBPf4fA==',
            node: {
              name: 'repo 2',
              id: 'repo2',
              url: 'https://github.com/repo2',
              owner: {
                login: 'dev',
                avatarUrl: 'https://avatars2.githubusercontent.com/dev',
              },
              isFork: false,
              createdAt: '2017-02-27T21:42:13Z',
            },
          },
          {
            cursor: 'Y3Vyc29yOnYyOpHOBPjVgA==',
            node: {
              name: 'repo 3',
              id: 'repo3',
              url: 'https://github.com/repo3',
              owner: {
                login: 'dev',
                avatarUrl: 'https://avatars0.githubusercontent.com/dev',
              },
              isFork: false,
              createdAt: '2017-02-28T09:52:10Z',
            },
          },
          {
            cursor: 'Y3Vyc29yOnYyOpHOBQFydA==',
            node: {
              name: 'repo 4',
              id: 'repo4',
              url: 'https://github.com/dev',
              owner: {
                login: 'dev',
                avatarUrl: 'https://avatars2.githubusercontent.com/dev',
              },
              isFork: false,
              createdAt: '2017-03-05T15:33:09Z',
            },
          },
          {
            cursor: 'Y3Vyc29yOnYyOpHOBQGvmw==',
            node: {
              name: 'repo 5',
              id: 'repo5',
              url: 'https://github.com/repo5',
              owner: {
                login: 'dev',
                avatarUrl: 'https://avatars2.githubusercontent.com/dev',
              },
              isFork: true,
              createdAt: '2017-03-05T19:35:42Z',
            },
          },
        ],
      },
    },
  },
});
