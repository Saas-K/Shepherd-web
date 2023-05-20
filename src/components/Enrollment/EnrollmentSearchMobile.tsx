import React, { useState } from 'react';
import { Avatar, Badge, Button, Col, DatePicker, Form, Input, Modal, Select } from 'antd';
import moment from 'moment';
import { FilterOutlined } from '@ant-design/icons';

import { IEnrollmentFilter } from './core/types';
import config from '../../_config';
import { countFilter } from '../../utils/Misc';

const EnrollmentSearchMobile = ({ filter, onSearch }: { filter: any; onSearch: (values: IEnrollmentFilter) => void }) => {
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
          onFinish={(values: IEnrollmentFilter) => {
            onSearch({
              page: 1,
              limit: 10,
              studentName: values.studentName,
              courseName: values.courseName,
              dateFrom: values.dateFrom ? moment(values.dateFrom).format(config.API_DATE_FORMAT) : undefined,
              dateTo: values.dateTo ? moment(values.dateTo).format(config.API_DATE_FORMAT) : undefined,
              active: values.active || undefined,
              sendNotification: values.sendNotification || undefined
            });
            setFilterCount(countFilter(form));
            setShow(false);
          }}
          layout='vertical'
        >
          <Form.Item name='studentName' label='Student name'>
            <Input />
          </Form.Item>
          <Form.Item name='courseName' label='Course name'>
            <Input />
          </Form.Item>
          <Form.Item name='dateFrom' label='From date'>
            <DatePicker placeholder='Select date' />
          </Form.Item>
          <Form.Item name='dateTo' label='To date'>
            <DatePicker placeholder='Select date' />
          </Form.Item>
          <Form.Item name='active' valuePropName='checked' label='Status'>
            <Select allowClear>
              <Select.Option value='true'>Active</Select.Option>
              <Select.Option value='false'>Inactive</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name='sendNotification' valuePropName='checked' label='SMS'>
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

export default EnrollmentSearchMobile;