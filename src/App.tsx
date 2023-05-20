import './App.scss';
import 'antd/dist/antd.css';
import './Tailwind.css';

import React, { ReactElement, useState } from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { decodeJwt, JWTPayload } from 'jose';

import routes from './_routes';
import Login from './components/Auth/Login';
import MenuBar from './components/_common/MenuBar';
import { STORAGE_ACCESS_TOKEN, STORAGE_USERNAME } from './components/_common/core/constants';

const { Content, Footer } = Layout;

function App() {
  const [update, setUpdate] = useState<boolean>(false);

  function isValidAccess() {
    const accessToken: string | null = localStorage.getItem(STORAGE_ACCESS_TOKEN);
    const username: string | null = localStorage.getItem(STORAGE_USERNAME);
    if (!accessToken || !username) {
      console.log('fuck 1');
      return false;
    }
    
    if (accessToken) {
      const decodedToken: JWTPayload = decodeJwt(accessToken);
      if (decodedToken && decodedToken.exp) {
        console.log('fuck 2');

        const currentTimestamp = Math.floor(Date.now() / 1000);
        const expirationTime = decodedToken.exp;
        console.log(currentTimestamp);
        console.log(expirationTime);
        return currentTimestamp <= expirationTime;
      }
    }
    return false;
  }

  function triggerUpdate() {
    setUpdate(!update);
  }

  return (
    <Router basename=''>
      {!isValidAccess() ? (<Login getAccess={triggerUpdate} />) : (
        <Layout className='h-full relative' >
          <Layout className='site-layout relative'>
            <MenuBar />
            <Content className='pl-5 pr-5 scrollbar'>
              <div className='site-layout-background px-1 py-1 h-full' style={{ minHeight: 360 }}>
                <Switch>
                  {routes.map((route, key: number): ReactElement => {
                    return <Route key={key} exact path={route.path} component={route.component} />;
                  })}
                </Switch>
              </div>
            </Content>
            {/* <Footer className='text-center p-3'>Footer</Footer> */}
          </Layout>
        </Layout>
      )}
    </Router>
  );
}

export default App;
