import './App.scss';
import 'antd/dist/antd.min.css';
import './Tailwind.css';

import React, { ReactElement } from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { decodeJwt, JWTPayload } from 'jose';

import routes from './_routes';
import Login from './components/Auth/Login';
import MenuBar from './components/_common/MenuBar';
import { STORAGE_ACCESS_TOKEN, STORAGE_USERNAME } from './components/_common/core/constants';

const { Content } = Layout;

function App() {
  function isValidAccess() {
    const accessToken: string | null = localStorage.getItem(STORAGE_ACCESS_TOKEN);
    const username: string | null = localStorage.getItem(STORAGE_USERNAME);
    if (!accessToken || !username) {
      return false;
    }
    
    if (accessToken) {
      const decodedToken: JWTPayload = decodeJwt(accessToken);
      if (decodedToken && decodedToken.exp) {

        const currentTimestamp = Math.floor(Date.now() / 1000);
        const expirationTime = decodedToken.exp;
        return currentTimestamp <= expirationTime;
      }
    }
    return false;
  }

  return (
    <Router basename=''>
      {!isValidAccess() ? (<Login />) : (
        <Layout className='h-full relative' >
          <Layout className='site-layout relative'>
            <MenuBar />
            <Content className='pl-5 pr-5 scrollbar'>
              <div className='site-layout-background px-1 py-1 h-full' style={{ minHeight: 360 }}>
                <Switch>
                  {routes.map((route, key: number): ReactElement => {
                    const _key = `${key}-x`;
                    return <Route key={_key} exact path={route.path} component={route.component} />;
                  })}
                </Switch>
              </div>
            </Content>
          </Layout>
        </Layout>
      )}
    </Router>
  );
}

export default App;
