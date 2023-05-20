import React, { useState } from 'react';
import { Avatar, Badge, Button, Card, Col, DatePicker, Form, Input, Modal, Select } from 'antd';
import moment from 'moment';
import { FilterOutlined } from '@ant-design/icons';

import { IPaymentFilter } from './core/types';
import config from '../../_config';
import { countFilter } from '../../utils/Misc';

const PaymentSearchMobile = ({ filter, onSearch }: { filter: any; onSearch: (values: IPaymentFilter) => void }) => {
  const [form] = Form.useForm();
  const [show, setShow] = useState<boolean>(false);
  const [filterCount, setFilterCount] = useState<number>(0);

  return (
    <section className='mb-5'>
      <Badge count={filterCount} showZero={false}>
        <Avatar shape="square" size="large" onClick={() => setShow(true)}><FilterOutlined style={{fontSize: '25px', color: 'black'}} /></Avatar>
      </Badge>

      <Modal open={show} onCancel={() => setShow(false)} footer={false}>
        <Form
          form={form}
          onFinish={(values: IPaymentFilter) => {
            onSearch({
              page: 1,
              limit: 10,
              courseName: values.courseName || undefined,
              studentName: values.studentName || undefined,
              dateFrom: values.dateFrom ? moment(values.dateFrom).format(config.API_DATE_FORMAT) : undefined,
              dateTo: values.dateTo ? moment(values.dateTo).format(config.API_DATE_FORMAT) : undefined,
              paidDateFrom: values.paidDateFrom ? moment(values.paidDateFrom).format(config.API_DATE_FORMAT) : undefined,
              paidDateTo: values.paidDateTo ? moment(values.paidDateTo).format(config.API_DATE_FORMAT) : undefined,
              paid: values.paid || undefined
            });
            setFilterCount(countFilter(form));
            setShow(false);
          }}
          layout='vertical'
        >
          <Form.Item name='courseName' label='Course name'>
            <Input />
          </Form.Item>
          <Form.Item name='studentName' label='Student name'>
            <Input />
          </Form.Item>
          <Form.Item name='dateFrom' label='From notice date'>
            <DatePicker placeholder='Select date' />
          </Form.Item>
          <Form.Item name='dateTo' label='To notice date'>
            <DatePicker placeholder='Select date' />
          </Form.Item>
          <Form.Item name='paidDateFrom' label='From paid date'>
            <DatePicker placeholder='Select date' />
          </Form.Item>
          <Form.Item name='paidDateTo' label='To paid date'>
            <DatePicker placeholder='Select date' />
          </Form.Item>
          <Form.Item name='paid' valuePropName='checked' label='Paid'>
            <Select allowClear>
              <Select.Option value='true'>Yes</Select.Option>
              <Select.Option value='false'>No</Select.Option>
            </Select>
          </Form.Item>

          <Col span={24} style={{ textAlign: 'right' }}>
            <Button
              onClick={() => {
                form.resetFields();
                setFilterCount(countFilter(form));
              }}
              className='mr-2'
            >
              Clear
            </Button>
            <Button type='primary' htmlType='submit'>
              Search
            </Button>
          </Col>
        </Form>
      </Modal>
    </section>
  );
}

export default PaymentSearchMobile;