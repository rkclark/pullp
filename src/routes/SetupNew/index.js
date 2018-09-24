import React from 'react';
import { Route } from 'react-router-dom';
import SignInForm from '../../components/SignInForm';

export default function SetupNew() {
  return (
    <div>
      <Route exact path="/app/setup/sign-in" component={SignInForm} />
    </div>
  );
}
