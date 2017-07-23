import React from 'react';
import logo from './logo.svg';
import style from './style.css';

export default function App() {
  return (
    <div className={style.root}>
      <div className={style.header}>
        <img src={logo} className={style.logo} alt="logo" />
        <h2>Welcome to React</h2>
      </div>
      <p className={style.intro}>
        To get started, edit <code>src/App.js</code> and save to reload.
      </p>
    </div>
  );
}
