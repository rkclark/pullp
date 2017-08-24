import React from 'react';

export default function ApiForm() {
  return (
    <div>
      <h2>Enter your Github oAuth App details:</h2>
      <label htmlFor="clientId">Client ID</label>
      <input name="clientId" type="text" />
      <label htmlFor="clientSecret">Client Secret</label>
      <input name="clientSecret" type="text" />
      <button>Save</button>
    </div>
  );
}
