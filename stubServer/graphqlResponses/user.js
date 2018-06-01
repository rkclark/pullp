module.exports = userLogin => ({
  data: {
    viewer: {
      login: userLogin,
      avatarUrl: 'https://githubimages/image',
      url: 'https://github.com/dev',
    },
  },
});
