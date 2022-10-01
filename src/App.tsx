import './App.scss';
import 'antd/dist/antd.css';
import './Tailwind.css';

import React, { ReactElement } from 'react';
import { Layout, Skeleton } from 'antd';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import Header from './components/_common/Header';
// import Sidebar from './components/_common/Sidebar';
import Header from './components/_common/Header';
import Sidebar from './components/_common/Sidebar';
import routes from './routes';

const { Content, Footer } = Layout;

function App() {
  return (
    <Router basename='cms'>
      <Layout className='h-full relative' >
        <Sidebar />
        <Layout className='site-layout relative'>
          <Header />
          <Content className='p-5 scrollbar'>
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
    </Router>
  );
}

export default App;
