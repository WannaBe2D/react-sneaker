import React from 'react';
import ReactDOM from 'react-dom';
import 'macro-css';
import App from './App';
import { BrowserRouter as Route, HashRouter } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
