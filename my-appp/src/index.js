import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Routers from './Route';

import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

// import AppRoute from './AppRoute';
import * as serviceWorker from './serviceWorker';


ReactDOM.render(<ConfigProvider locale={zhCN}><Routers /></ConfigProvider>,document.getElementById('root'));

serviceWorker.unregister();
