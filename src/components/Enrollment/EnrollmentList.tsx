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
import { IEnrollment, IEnrollmentFilter } from './core/types';
import { IPageResponse } from '../_common/core/types';
import * as misc from '../../utils/Misc';
import EnrollmentSearch from './EnrollmentSearch';

export default function EnrollmentList() {
  const [enrollmentList, setEnrollmentList] = useState<IEnrollment[]>([]);
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
      .getListEnrollments(filter)
      .then((res: IPageResponse<IEnrollment>) => {
        setEnrollmentList([...res.list]);
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

  const _renderAction = (record: IEnrollment) => {
    let element: JSX.Element | null = null;
    element = (
      <Space>
        <Link to={`/enrollment/${record.id}/update`} component={Typography.Link} title='Edit'>
          <EditOutlined />
        </Link>
        <Link to={`/enrollment/${record.id}`} component={Typography.Link} title='View'>
          <EyeOutlined />
        </Link>
      </Space>
    );
    return element;
  };

  const _renderExtra = () => {
    return (
      <Button type='primary' onClick={() => {history.push('/enrollment/new')}}>
        + Create
      </Button>
    );
  };

  return (
    <>
      <PageHeader className='site-page-header' title='Enrollments' extra={_renderExtra()} />
      <EnrollmentSearch
        filter={query}
        onSearch={(values: IEnrollmentFilter) => {
          misc.changeBrowserLocation(history, pathname, values);
          fetchData(values);
        }}
      />
      {loading ? (
        <ComponentLoading />
      ) : (
        <section>
          <Card>
            <Table 
            scroll={{ scrollToFirstRowOnChange: true, x: 'max-content' }} dataSource={enrollmentList} pagination={{ ...pagination, showSizeChanger: true, onChange: onPageChange }} rowKey='id'>
              <Table.Column title='Student Name' dataIndex={['student', 'name']} />
              <Table.Column title='Course Name' dataIndex={['course', 'name']} />
              <Table.Column title='Status' dataIndex='active' render={(active: boolean) => active ? <Tag color='success'>Active</Tag> : <Tag color='error'>Inactive</Tag>} />
              <Table.Column title='SMS' dataIndex='sendNotification' render={(notify: boolean) => notify ? 'Yes': 'No'} />
              <Table.Column
                title='Action'
                render={(_value: string, record: IEnrollment) => {
                  return _renderAction(record);
                }}
              />
              <Table.Column dataIndex='id' />
            </Table>
          </Card>
        </section>
      )}
    </>
  );
}
