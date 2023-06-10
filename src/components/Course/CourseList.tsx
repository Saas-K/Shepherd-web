import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Table, PageHeader, Card, message, Button, Tag } from 'antd';
import queryString from 'query-string';

import * as service from './core/service';
import ComponentLoading from '../_common/ComponentLoading';
import { ICourse, ICourseFilter } from './core/types';
import { IPageResponse } from '../_common/core/types';
import * as misc from '../../utils/Misc';
import CourseSearch from './CourseSearch';
import { currency } from '../../utils/StringUtils';
import { formatVNDate } from '../../utils/DateTimeUtils';
import { STORAGE_MOBILE } from '../_common/core/constants';
import CourseSearchMobile from './CourseSearchMobile';
import renderAction from '../_common/RenderActions';

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

  const _renderExtra = () => {
    return (
      <Button type='primary' onClick={() => {history.push('/course/new')}}>
        + Create
      </Button>
    );
  };

  return (
    <>
      <PageHeader className='site-page-header' title='Courses' extra={_renderExtra()} />
      {localStorage.getItem(STORAGE_MOBILE) === 'true' ? 
      <CourseSearchMobile 
        filter={query}
        onSearch={(values: ICourseFilter) => {
          misc.changeBrowserLocation(history, pathname, values);
          fetchData(values);
        }}
      /> : <CourseSearch
        filter={query}
        onSearch={(values: ICourseFilter) => {
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
            scroll={{ scrollToFirstRowOnChange: true, x: 'max-content' }} dataSource={courseList} pagination={{ ...pagination, showSizeChanger: true, onChange: onPageChange }} rowKey='id'>
              <Table.Column title='Name' dataIndex='name' />
              <Table.Column title='Start date' dataIndex='startDate' render={(date: Date) => formatVNDate(date)} />
              <Table.Column title='Status' dataIndex='active' render={(active: boolean) => active ? <Tag color='success'>Active</Tag> : <Tag color='error'>Inactive</Tag>} />
              <Table.Column title='Price (per class)' dataIndex='pricePerClass' render={(_price: string) => currency(_price)} />
              <Table.Column title='Classes (per week)' dataIndex='classPerWeek' />
              <Table.Column title='Description' dataIndex='description' />
              <Table.Column
                title=''
                render={(_value: string, record: ICourse) => {
                  return renderAction(`/course/${record.id}`);
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
