import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  CalendarOutlined,
  ReadOutlined,
  TeamOutlined,
  AuditOutlined,
  DollarCircleOutlined,
} from '@ant-design/icons';

function IconContainer({ src, title, hasChildren }: { src: any; title?: string; hasChildren?: boolean }) {
  return <img style={{ width: '1.15rem', height: '1.15rem' }} className={`-mt-1 inline-block ${hasChildren ? 'mr-4' : 'mr-3'}`} src={src} alt={title} />;
}

export default function Sidebar() {
  const [menuItems, setMenuItemsState] = useState<any[]>([
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

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [openKeys, setOpenKeysState]: [any, (keys: any) => void] = useState([]);
  const [oldKey, setOldKey] = useState('1');
  const defaultSelectedKeys: string[] = ['1'];

  return (
    <Layout.Sider style={{ background: 'white' }} width={230} collapsible collapsed={collapsed} onCollapse={(value: boolean | ((prevState: boolean) => boolean)) => setCollapsed(value)}>
      <div className='sidebar__title'>
        Side bar title
      </div>
      {menuItems && (
        <div className='sidebar__menu'>
          <Menu
            mode='inline'
            className='border-none'
            defaultSelectedKeys={defaultSelectedKeys}
            openKeys={openKeys}
          >
            {menuItems.map(({ key, path, title, icon, children }) => {
              if (children) {
                return (
                  <Menu.SubMenu
                    key={key}
                    icon={icon}
                    title={collapsed ? undefined : title}
                    onTitleClick={() => {
                      if (openKeys.indexOf(key) !== -1) {
                        const values = openKeys.filter((k: string) => k !== key);
                        setOpenKeysState(values);
                      } else {
                        const values = [...openKeys, key];
                        setOpenKeysState(values);
                      }
                    }}
                  >
                    {children &&
                      children?.map((child: any) => {
                        return (
                          <Menu.Item key={child.key}>
                            <span className='menu_text'>{child.title}</span>
                            <Link to={child.path} title={child.title} />
                          </Menu.Item>
                        );
                      })}
                  </Menu.SubMenu>
                );
              }
              return (
                <Menu.Item key={key} icon={icon}>
                  <span className='menu_text'>{title}</span>
                  <Link to={path} title={title} />
                </Menu.Item>
              );
            })}
          </Menu>
        </div>
      )}
    </Layout.Sider>
  );
};
