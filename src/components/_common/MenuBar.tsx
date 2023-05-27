import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button, Divider, Dropdown, Menu } from 'antd';
import {
  CalendarOutlined,
  ReadOutlined,
  TeamOutlined,
  AuditOutlined,
  DollarCircleOutlined,
  MenuOutlined,
} from '@ant-design/icons';

export default function MenuBar() {
  const history = useHistory();
  const [menuItems,] = useState<any[]>([
    {
      key: 'course',
      path: '/course',
      icon: <ReadOutlined />,
      title: 'Courses',
    },
    {
      key: 'student',
      path: '/student',
      icon: <TeamOutlined />,
      title: 'Students',
    },
    {
      key: 'enrollment',
      path: '/enrollment',
      icon: <AuditOutlined />,
      title: 'Enrollments',
    },
    {
      key: 'payment',
      path: '/payment',
      icon: <DollarCircleOutlined />,
      title: 'Payments',
    },
    {
      key: 'time',
      path: '#',
      title: 'Time',
      icon: <CalendarOutlined />,
      children: [
        {
          key: 'calendar',
          path: '/calendar',
          title: 'Calendar',
        },
        {
          key: 'schedule',
          path: '/schedule',
          title: 'Schedule',
        }
      ],
    },
  ]);

  const renderMenuItem = (item: any) => {
    if (item.children) {
      return (
        <Menu.Item key={item.key} icon={item.icon} title={item.title}>
          <Dropdown
            overlay={
              <Menu className='sidebar__menu'>
                {item.children.map((childItem: any) => (
                  <Menu.Item key={childItem.key}>
                    <span className='menu_text'>{childItem.title}</span>
                    <Link to={childItem.path} title={childItem.title} />
                  </Menu.Item>
                ))}
              </Menu>
            }
          >
            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
              Time
            </a>
          </Dropdown>
        </Menu.Item>
      );
    }
  
    return (
      <Menu.Item key={item.key} icon={item.icon} >
        <span className='menu_text'>{item.title}</span>
        <Link to={item.path} title={item.title} />
      </Menu.Item>
    );
  };
  

  return (
    <div className='ml-5' style={{width: '50%'}} >
    <Dropdown
      overlay={
        <Menu className='sidebar__menu'>
          <Menu.Item disabled style={{textAlign: 'center'}}>
            <strong>{localStorage.getItem('username')}</strong>
          </Menu.Item>
          <Divider style={{marginTop: '5px'}} />
          {menuItems.map((item) => renderMenuItem(item))}
          <Divider style={{marginBottom: '5px'}} />
          <Menu.Item>
            <Button type='ghost' block onClick={async (event: React.MouseEvent) => {
              event.preventDefault();
              localStorage.clear();
              history.push('/login');
              window.location.reload();
            }}>
              Logout
            </Button>
          </Menu.Item>
        </Menu>
      }
      trigger={['click']}
    >
      <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
        <MenuOutlined style={{fontSize: '20px', fontStyle: 'bold', marginTop: '15px'}} />
      </a>
    </Dropdown>
    </div>
  );
};
