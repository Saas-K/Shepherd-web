import './App.scss';
import 'antd/dist/antd.css';
import './Tailwind.css';

import React, { ReactElement, useState } from 'react';
import { Layout, Skeleton } from 'antd';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/_common/Header';
import Sidebar from './components/_common/Sidebar';
import routes from './_routes';
import Login from './components/Auth/Login';

const { Content, Footer } = Layout;

function App() {
  const [update, setUpdate] = useState<boolean>(false);

  function isValidAccess() {
    return !!localStorage.getItem('username') && !!localStorage.getItem('accessToken');
  }

  function triggerUpdate() {
    setUpdate(!update);
  }
  
  return (
    <Router basename=''>
      {!isValidAccess() ? (<Login getAccess={triggerUpdate} />) : (
        <Layout className='h-full relative' >
        <Sidebar />
          <Layout className='site-layout relative'>
            <Header />
            <Content className='pl-5 pr-5 scrollbar'>
              <div className='site-layout-background px-1 py-1 h-full' style={{ minHeight: 360 }}>
                <Switch>
                  {routes.map((route, key: number): ReactElement => {
                    return <Route key={key} exact path={route.path} component={route.component} />;
                  })}
                </Switch>
              </div>
            </Content>
            <Footer className='text-center p-3'>Footer</Footer>
          </Layout>
        </Layout>
      )}
    </Router>
  );
}

export default App;
