import React from 'react';
import ReactDOM from 'react-dom';
import 'macro-css';
import App from './App';
import { BrowserRouter as Route } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <Route>
      <App />
    </Route>
  </React.StrictMode>,
  document.getElementById('root')
);
