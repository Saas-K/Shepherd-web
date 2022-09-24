import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import EN_GB from 'antd/lib/locale-provider/en_GB';
import moment from 'moment';
import 'moment/locale/en-gb';  // important!
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

moment.locale('en-gb');
ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider locale={EN_GB}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
