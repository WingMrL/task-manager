import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import App from './modules/App';
import configureStore from '../src/store/create.pro';

const store = configureStore();
ReactDOM.render(
  <Provider store={store}>
      <App/>
  </Provider>,
  document.getElementById('root')
);