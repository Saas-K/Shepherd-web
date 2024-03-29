import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Table, PageHeader, Card, message, Button, Tag } from 'antd';
import queryString from 'query-string';

import * as service from './core/service';
import ComponentLoading from '../_common/ComponentLoading';
import { IPayment, IPaymentFilter } from './core/types';
import { IPageResponse } from '../_common/core/types';
import * as misc from '../../utils/Misc';
import PaymentSearch from './PaymentSearch';
import { currency } from '../../utils/StringUtils';
import { formatVNDate } from '../../utils/DateTimeUtils';
import { STORAGE_MOBILE } from '../_common/core/constants';
import PaymentSearchMobile from './PaymentSearchMobile';
import renderActions from '../_common/RenderActions';

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
      {localStorage.getItem(STORAGE_MOBILE) === 'true' ? 
        <PaymentSearchMobile
          filter={query}
          onSearch={(values: IPaymentFilter) => {
            misc.changeBrowserLocation(history, pathname, values);
            fetchData(values);
          }}
        /> : <PaymentSearch
          filter={query}
          onSearch={(values: IPaymentFilter) => {
            misc.changeBrowserLocation(history, pathname, values);
            fetchData(values);
          }}
        />
      }
      {loading ? (
        <ComponentLoading />
      ) : (
        <section>
          <Card>
            <Table 
            scroll={{ scrollToFirstRowOnChange: true, x: 'max-content' }} dataSource={paymentList} pagination={{ ...pagination, showSizeChanger: true, onChange: onPageChange }} rowKey='id'>
              <Table.Column title='Course name' dataIndex='courseName' />
              <Table.Column title='Student name' dataIndex='studentName' />
              <Table.Column title='Price' dataIndex='price' render={(_price: string) => currency(_price)} />
              <Table.Column title='Debt' dataIndex='unpaid' render={(_unpaid: string) => currency(_unpaid)} />
              <Table.Column title='Notice date' dataIndex='date' render={(_date: Date) => formatVNDate(_date)} />
              <Table.Column title='Paid date' dataIndex='paidDate' render={(_date: Date) => formatVNDate(_date)} />
              <Table.Column title='SMS' dataIndex='sendNotification' render={(active: boolean) => active ? <Tag color='success'>Yes</Tag> : <Tag color='error'>No</Tag>} />
              <Table.Column
                title=''
                render={(_value: string, record: IPayment) => {
                  return renderActions(`/payment/${record.id}`);
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
