import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Table, PageHeader, Card, message, Space, Typography, Button, Tag } from 'antd';
import queryString from 'query-string';
import {
  EyeOutlined,
  EditOutlined,
} from '@ant-design/icons';

import * as service from './core/service';
import ComponentLoading from '../_common/ComponentLoading';
import { IStudent, IStudentFilter } from './core/types';
import { IPageResponse } from '../_common/core/types';
import * as misc from '../../utils/Misc';
import StudentSearch from './StudentSearch';
import StudentSearchMobile from './StudentSearchMobile';
import { STORAGE_MOBILE } from '../_common/core/constants';

export default function StudentList() {
  const [studentList, setStudentList] = useState<IStudent[]>([]);
  const [pagination, setPagination]: [any, (pagination?: any) => void] = useState();
  const [loading, setLoadingState] = useState(true);
  const history = useHistory();
  const { pathname, search } = useLocation();

  const query = queryString.parse(search);

  useEffect(() => {
    fetchData({ ...query, page: 1, limit: 10 });
  }, []);

  function fetchData(filter: any) {
    service
      .getListStudents(filter)
      .then((res: IPageResponse<IStudent>) => {
        setStudentList([...res.list]);
        setPagination({
          current: res.currentPage,
          pageSize: res.pageSize,
          total: res.totalItems
        });
      })
      .catch((error) => {
        message.error(error.message);
      })
      .finally(() => {
        setLoadingState(false);
      });
  }

  function onPageChange(page: number, limit: number) {
    const filter: any = { ...query, page, limit };
    misc.changeBrowserLocation(history, pathname, filter);
    setLoadingState(true);
    fetchData(filter);
  }

  const _renderAction = (record: IStudent) => {
    let element: JSX.Element | null = null;
    element = (
      <Space>
        <Link to={`/student/${record.id}/update`} component={Typography.Link} title='Edit'>
          <EditOutlined />
        </Link>
        <Link to={`/student/${record.id}`} component={Typography.Link} title='View'>
          <EyeOutlined />
        </Link>
      </Space>
    );
    return element;
  };

  const _renderExtra = () => {
    return (
      <Button type='primary' onClick={() => {history.push('/student/new')}}>
        + Create
      </Button>
    );
  };

  return (
    <>
      <PageHeader className='site-page-header' title='Students' extra={_renderExtra()} />
      {localStorage.getItem(STORAGE_MOBILE) === 'true' ? 
      <StudentSearchMobile
        filter={query}
        onSearch={(values: IStudentFilter) => {
          misc.changeBrowserLocation(history, pathname, values);
          fetchData(values);
        }}
      /> : <StudentSearch
        filter={query}
        onSearch={(values: IStudentFilter) => {
          misc.changeBrowserLocation(history, pathname, values);
          fetchData(values);
        }}
      />}
      {loading ? (
        <ComponentLoading />
      ) : (
        <section>
          <Card>
            <Table 
            scroll={{ scrollToFirstRowOnChange: true, x: 'max-content' }} dataSource={studentList} pagination={{ ...pagination, showSizeChanger: true, onChange: onPageChange }} rowKey='id'>
              <Table.Column title='Name' dataIndex='name' />
              <Table.Column title='Mobile' dataIndex='mobile' />
              <Table.Column title='Parent mobile' dataIndex='parentMobile' />
              <Table.Column title='Note' dataIndex='note' />
              <Table.Column title='Status' dataIndex='active' render={(active: boolean) => active ? <Tag color='success'>Active</Tag> : <Tag color='error'>Inactive</Tag>} />
              <Table.Column
                title='Action'
                render={(_value: string, record: IStudent) => {
                  return _renderAction(record);
                }}
                fixed='right'
              />
            </Table>
          </Card>
        </section>
      )}
    </>
  );
}
