import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Routers from './Route';
// import AppRoute from './AppRoute';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Routers />,document.getElementById('root'));

serviceWorker.unregister();
