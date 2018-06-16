module.exports = responseIndex => {
  const responses = [
    {
      data: {
        nodes: [
          {
            id: 'repo1',
            pullRequests: {
              totalCount: 1,
              edges: [
                {
                  node: {
                    createdAt: '2018-05-31T10:53:51Z',
                    url: 'https://github.com/',
                    number: 162,
                    title: 'Dockerise test suite',
                    author: {
                      avatarUrl: 'https://avatars1.githubusercontent.com/',
                      login: 'dev5',
                      url: 'https://github.com/',
                    },
                    reviewRequests: { edges: [] },
                    reviews: {
                      edges: [
                        {
                          node: {
                            author: {
                              login: 'dev',
                              avatarUrl:
                                'https://avatars3.githubusercontent.com/',
                            },
                            createdAt: '2018-05-31T11:22:08Z',
                            state: 'DISMISSED',
                          },
                        },
                        {
                          node: {
                            author: {
                              login: 'dev2',
                              avatarUrl:
                                'https://avatars3.githubusercontent.com/',
                            },
                            createdAt: '2018-05-31T11:25:05Z',
                            state: 'CHANGES_REQUESTED',
                          },
                        },
                        {
                          node: {
                            author: {
                              login: 'dev3',
                              avatarUrl:
                                'https://avatars3.githubusercontent.com/',
                            },
                            createdAt: '2018-05-31T12:59:32Z',
                            state: 'CHANGES_REQUESTED',
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
          {
            id: 'repo2',
            pullRequests: { totalCount: 0, edges: [] },
          },
          {
            id: 'repo3',
            pullRequests: { totalCount: 0, edges: [] },
          },
          {
            id: 'repo5',
            pullRequests: {
              totalCount: 2,
              edges: [
                {
                  node: {
                    createdAt: '2018-05-29T15:31:08Z',
                    url: 'https://github.com/',
                    number: 75,
                    title: 'update readme',
                    author: {
                      avatarUrl: 'https://avatars1.githubusercontent.com/',
                      login: 'dev2',
                      url: 'https://github.com/dev2',
                    },
                    reviewRequests: {
                      edges: [
                        {
                          node: {
                            requestedReviewer: {
                              login: 'dev',
                              avatarUrl:
                                'https://avatars0.githubusercontent.com/',
                            },
                          },
                        },
                      ],
                    },
                    reviews: {
                      edges: [
                        {
                          node: {
                            author: {
                              login: 'dev3',
                              avatarUrl:
                                'https://avatars1.githubusercontent.com/',
                            },
                            createdAt: '2018-05-29T15:38:16Z',
                            state: 'APPROVED',
                          },
                        },
                        {
                          node: {
                            author: {
                              login: 'dev4',
                              avatarUrl:
                                'https://avatars1.githubusercontent.com/',
                            },
                            createdAt: '2018-05-30T10:47:43Z',
                            state: 'CHANGES_REQUESTED',
                          },
                        },
                      ],
                    },
                  },
                },
                {
                  node: {
                    createdAt: '2018-04-05T09:06:34Z',
                    url: 'https://github.com/',
                    number: 12,
                    title: 'Add integration tests',
                    author: {
                      avatarUrl: 'https://avatars1.githubusercontent.com/',
                      login: 'dev3',
                      url: 'https://github.com/dev3',
                    },
                    reviewRequests: { edges: [] },
                    reviews: { edges: [] },
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      data: {
        nodes: [
          {
            id: 'repo1',
            pullRequests: {
              totalCount: 3,
              edges: [
                {
                  node: {
                    createdAt: '2018-05-31T10:53:51Z',
                    url: 'https://github.com/',
                    number: 162,
                    title: 'Dockerise test suite',
                    author: {
                      avatarUrl: 'https://avatars1.githubusercontent.com/',
                      login: 'dev5',
                      url: 'https://github.com/',
                    },
                    reviewRequests: { edges: [] },
                    reviews: {
                      edges: [
                        {
                          node: {
                            author: {
                              login: 'dev',
                              avatarUrl:
                                'https://avatars3.githubusercontent.com/',
                            },
                            createdAt: '2018-05-31T11:22:08Z',
                            state: 'DISMISSED',
                          },
                        },
                        {
                          node: {
                            author: {
                              login: 'dev2',
                              avatarUrl:
                                'https://avatars3.githubusercontent.com/',
                            },
                            createdAt: '2018-05-31T11:25:05Z',
                            state: 'CHANGES_REQUESTED',
                          },
                        },
                        {
                          node: {
                            author: {
                              login: 'dev3',
                              avatarUrl:
                                'https://avatars3.githubusercontent.com/',
                            },
                            createdAt: '2018-05-31T12:59:32Z',
                            state: 'CHANGES_REQUESTED',
                          },
                        },
                      ],
                    },
                  },
                },
                {
                  node: {
                    createdAt: '2018-05-31T10:53:51Z',
                    url: 'https://github.com/',
                    number: 163,
                    title: 'Dockerise test suite',
                    author: {
                      avatarUrl: 'https://avatars1.githubusercontent.com/',
                      login: 'dev5',
                      url: 'https://github.com/',
                    },
                    reviewRequests: { edges: [] },
                    reviews: {
                      edges: [
                        {
                          node: {
                            author: {
                              login: 'dev',
                              avatarUrl:
                                'https://avatars3.githubusercontent.com/',
                            },
                            createdAt: '2018-05-31T11:22:08Z',
                            state: 'DISMISSED',
                          },
                        },
                        {
                          node: {
                            author: {
                              login: 'dev2',
                              avatarUrl:
                                'https://avatars3.githubusercontent.com/',
                            },
                            createdAt: '2018-05-31T11:25:05Z',
                            state: 'CHANGES_REQUESTED',
                          },
                        },
                        {
                          node: {
                            author: {
                              login: 'dev3',
                              avatarUrl:
                                'https://avatars3.githubusercontent.com/',
                            },
                            createdAt: '2018-05-31T12:59:32Z',
                            state: 'CHANGES_REQUESTED',
                          },
                        },
                      ],
                    },
                  },
                },
                {
                  node: {
                    createdAt: '2018-05-31T10:53:51Z',
                    url: 'https://github.com/',
                    number: 164,
                    title: 'Dockerise test suite',
                    author: {
                      avatarUrl: 'https://avatars1.githubusercontent.com/',
                      login: 'dev5',
                      url: 'https://github.com/',
                    },
                    reviewRequests: { edges: [] },
                    reviews: {
                      edges: [
                        {
                          node: {
                            author: {
                              login: 'dev',
                              avatarUrl:
                                'https://avatars3.githubusercontent.com/',
                            },
                            createdAt: '2018-05-31T11:22:08Z',
                            state: 'DISMISSED',
                          },
                        },
                        {
                          node: {
                            author: {
                              login: 'dev2',
                              avatarUrl:
                                'https://avatars3.githubusercontent.com/',
                            },
                            createdAt: '2018-05-31T11:25:05Z',
                            state: 'CHANGES_REQUESTED',
                          },
                        },
                        {
                          node: {
                            author: {
                              login: 'dev3',
                              avatarUrl:
                                'https://avatars3.githubusercontent.com/',
                            },
                            createdAt: '2018-05-31T12:59:32Z',
                            state: 'CHANGES_REQUESTED',
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
          {
            id: 'repo2',
            pullRequests: { totalCount: 0, edges: [] },
          },
          {
            id: 'repo3',
            pullRequests: { totalCount: 0, edges: [] },
          },
          {
            id: 'repo4',
            pullRequests: { totalCount: 0, edges: [] },
          },
          {
            id: 'repo5',
            pullRequests: {
              totalCount: 2,
              edges: [
                {
                  node: {
                    createdAt: '2018-05-29T15:31:08Z',
                    url: 'https://github.com/',
                    number: 75,
                    title: 'update readme',
                    author: {
                      avatarUrl: 'https://avatars1.githubusercontent.com/',
                      login: 'dev2',
                      url: 'https://github.com/dev2',
                    },
                    reviewRequests: {
                      edges: [
                        {
                          node: {
                            requestedReviewer: {
                              login: 'dev',
                              avatarUrl:
                                'https://avatars0.githubusercontent.com/',
                            },
                          },
                        },
                      ],
                    },
                    reviews: {
                      edges: [
                        {
                          node: {
                            author: {
                              login: 'dev3',
                              avatarUrl:
                                'https://avatars1.githubusercontent.com/',
                            },
                            createdAt: '2018-05-29T15:38:16Z',
                            state: 'APPROVED',
                          },
                        },
                        {
                          node: {
                            author: {
                              login: 'dev4',
                              avatarUrl:
                                'https://avatars1.githubusercontent.com/',
                            },
                            createdAt: '2018-05-30T10:47:43Z',
                            state: 'CHANGES_REQUESTED',
                          },
                        },
                      ],
                    },
                  },
                },
                {
                  node: {
                    createdAt: '2018-04-05T09:06:34Z',
                    url: 'https://github.com/',
                    number: 12,
                    title: 'Add integration tests',
                    author: {
                      avatarUrl: 'https://avatars1.githubusercontent.com/',
                      login: 'dev3',
                      url: 'https://github.com/dev3',
                    },
                    reviewRequests: { edges: [] },
                    reviews: { edges: [] },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ];

  return responses[responseIndex];
};
