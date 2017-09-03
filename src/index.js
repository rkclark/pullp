import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Link,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Home from './routes/Home';
import Login from './routes/Login';
import App from './routes/App';
import Counter from './routes/Counter';
import './css/index.css';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        {window.location.pathname.includes('index.html') && <Redirect to="/" />}
        <Route exact path="/" component={Home} />
        <Route exact path="/app" component={App} />
        <Route exact path="/counter" component={Counter} />
        <Route exact path="/login" component={Login} />
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
      </div>
    </Router>
  </Provider>,
  document.getElementById('root'),
);
