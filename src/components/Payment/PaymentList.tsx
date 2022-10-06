import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Table, PageHeader, Card, message, Space, Typography, Button } from 'antd';
import queryString from 'query-string';
import {
  EyeOutlined,
  EditOutlined,
} from '@ant-design/icons';

import * as service from './core/service';
import ComponentLoading from '../_common/ComponentLoading';
import { IPayment, IPaymentFilter } from './core/types';
import { IPageResponse } from '../_common/core/types';
import * as misc from '../../utils/Misc';
import PaymentSearch from './PaymentSearch';

export default function PaymentList() {
  const [paymentList, setPaymentList] = useState<IPayment[]>([]);
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
      .getListPayments(filter)
      .then((res: IPageResponse<IPayment>) => {
        setPaymentList([...res.list]);
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

  const _renderAction = (record: IPayment) => {
    let element: JSX.Element | null = null;
    element = (
      <Space>
        <Link to={`/payment/${record.id}/update`} component={Typography.Link} title='Edit'>
          <EditOutlined />
        </Link>
        <Link to={`/payment/${record.id}`} component={Typography.Link} title='View'>
          <EyeOutlined />
        </Link>
      </Space>
    );
    return element;
  };

  const _renderExtra = () => {
    return (
      <Button type='primary' onClick={() => {history.push('/payment/new')}}>
        + Create
      </Button>
    );
  };

  return (
    <>
      <PageHeader className='site-page-header' title='Payments' extra={_renderExtra()} />
      <PaymentSearch
        filter={query}
        onSearch={(values: IPaymentFilter) => {
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
            scroll={{ scrollToFirstRowOnChange: true, x: 'max-content' }} dataSource={paymentList} pagination={{ ...pagination, showSizeChanger: true, onChange: onPageChange }} rowKey='id'>
              <Table.Column title='Course name' dataIndex='courseName' />
              <Table.Column title='Student name' dataIndex='studentName' />
              <Table.Column title='Parent mobile' dataIndex='parentMobile' />
              <Table.Column title='Price' dataIndex='price' />
              <Table.Column title='Debt' dataIndex='unpaid' />
              <Table.Column title='Notice date' dataIndex='date' />
              <Table.Column title='Paid date' dataIndex='paidDate' />
              <Table.Column title='SMS' dataIndex='sendNotification' render={(active: boolean) => active ? 'Yes': 'No'} />
              <Table.Column
                title='Action'
                render={(_value: string, record: IPayment) => {
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
