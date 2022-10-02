import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Table, PageHeader, Card, message, Space, Typography } from 'antd';
import queryString from 'query-string';
import {
  EyeOutlined,
  EditOutlined
} from '@ant-design/icons';

import * as service from './core/service';
import ComponentLoading from '../_common/ComponentLoading';
import { ICourse, ICourseFilter } from './core/types';
import { IPageResponse } from '../_common/core/types';
import * as misc from '../../utils/Misc';
import CourseSearch from './CourseSearch';

export default function CourseList() {
  const [courseList, setCourseList] = useState<ICourse[]>([]);
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
      .getListCourses(filter)
      .then((res: IPageResponse<ICourse>) => {
        setCourseList([...res.list]);
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

  const _renderAction = (record: ICourse) => {
    let element: JSX.Element | null = null;
    element = (
      <Space>
        <Link to={`/course/${record.id}/edit`} component={Typography.Link} title='Edit'>
          <EditOutlined />
        </Link>
        <Link to={`/course/${record.id}`} component={Typography.Link} title='View'>
          <EyeOutlined />
        </Link>
      </Space>
    );
    return element;
  };

  return (
    <>
      <PageHeader className='site-page-header' title='Courses' />
      <CourseSearch
        filter={query}
        onSearch={(values: ICourseFilter) => {
          misc.changeBrowserLocation(history, pathname, values);
          fetchData(values);
        }}
      />
      {loading ? (
        <ComponentLoading />
      ) : (
        <section className='mr-24'>
          <Card title='Callback Log'>
            <Table 
            scroll={{ scrollToFirstRowOnChange: true, x: 'max-content' }} dataSource={courseList} pagination={{ ...pagination, showSizeChanger: true, onChange: onPageChange }} rowKey='id'>
              <Table.Column title='Name' dataIndex='name' />
              <Table.Column title='Start date' dataIndex='startDate' />
              <Table.Column title='Active' dataIndex='active' />
              <Table.Column title='Price (per class)' dataIndex='pricePerClass' />
              <Table.Column title='Classes (per week)' dataIndex='classPerWeek' />
              <Table.Column title='Description' dataIndex='description' />
              <Table.Column
                title='Action'
                render={(_value: string, record: ICourse) => {
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