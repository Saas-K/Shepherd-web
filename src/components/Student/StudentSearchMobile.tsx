import React, { useState } from 'react';
import { Avatar, Badge, Button, Col, Form, Input, Modal, Select } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

import { IStudentFilter } from './core/types';
import { countFilter } from '../../utils/Misc';

const StudentSearchMobile = ({ filter, onSearch }: { filter: any; onSearch: (values: IStudentFilter) => void }) => {
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
          onFinish={(values: IStudentFilter) => {
            onSearch({
              page: 1,
              limit: 10,
              name: values.name || undefined,
              mobile: values.mobile || undefined,
              parentMobile: values.parentMobile || undefined,
              active: values.active || undefined
            });
            setFilterCount(countFilter(form));
            setShow(false);
          }}
          layout='vertical'
        >
          <Form.Item name='name' label='Student name'>
            <Input />
          </Form.Item>
          <Form.Item name='mobile' label='Mobile'>
            <Input />
          </Form.Item>
          <Form.Item name='parentMobile' label='Parent mobile'>
            <Input />
          </Form.Item>
          <Form.Item name='active' valuePropName='checked' label='Status'>
            <Select allowClear>
              <Select.Option value='true'>Active</Select.Option>
              <Select.Option value='false'>Inactive</Select.Option>
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

export default StudentSearchMobile;