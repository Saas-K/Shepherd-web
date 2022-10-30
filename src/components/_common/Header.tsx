import React from 'react';
import { Layout, Menu, Dropdown } from 'antd';
import { useHistory } from 'react-router-dom';

export default function Header() {
  const history = useHistory();

  const menu: JSX.Element = (
    <Menu className='float-right' style={{ minWidth: 200 }}>
      <Menu.Item>
        <a
          href='/'
          title='Logout'
          onClick={async (event: React.MouseEvent) => {
            event.preventDefault();
            localStorage.clear();
            history.push('/login');
            window.location.reload();
          }}
        >
          Logout
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout.Header className='site-layout-background p-0'>
      <Dropdown trigger={['click']} overlay={menu} className='float-right mr-3'>
        <a href='/' className='ant-dropdown-link' onClick={(e) => e.preventDefault()}>
          <strong>{localStorage.getItem('username')}</strong>
        </a>
      </Dropdown>
    </Layout.Header>
  );
}