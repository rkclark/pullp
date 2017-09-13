export const queries = {
  currentUser: () =>
    `
query {
	viewer {
    login
    avatarUrl
  }
}
`,
};

export const get = async query => {
  const body = {
    query,
  };

  const response = await fetch('https://api.github.com/graphql', {
    method: 'post',
    headers: {
      'Content-type': 'application/json',
      Authorization: `bearer f58ff8a83faf4023c8ea192132ecaf8f7bb704a2`,
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    const result = await response.json();
    console.log(result);
    return result;
  }

  throw new Error('Github is not ok :(');
};
