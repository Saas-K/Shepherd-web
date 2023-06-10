import React from 'react';
import { Link } from 'react-router-dom';
import { Space, Typography, Menu, Dropdown } from 'antd';
import {
  FormOutlined,
} from '@ant-design/icons';

const renderActions = (viewLink: string) => {
  const menu = (
    <Menu style={{width: '200%', textAlign: 'center'}} >
      <Menu.Item key="edit">
        <Link to={`${viewLink}/update`} component={Typography.Link} title='Edit'>
          Edit
        </Link>
      </Menu.Item>
      <Menu.Item key="view">
        <Link to={viewLink} component={Typography.Link} title='View'>
          View
        </Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Space>
      <Dropdown overlay={menu} trigger={['click']} placement='bottomRight'>
        <FormOutlined />
      </Dropdown>
    </Space>
  );
};

export default renderActions;