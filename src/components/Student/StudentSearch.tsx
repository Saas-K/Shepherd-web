import React from 'react';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';

import { IStudentFilter } from './core/types';

const StudentSearch = ({ filter, onSearch }: { filter: any; onSearch: (values: IStudentFilter) => void }) => {
  const [form] = Form.useForm();

  return (
    <section>
      <Card>
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
          }}
          layout='vertical'
        >
          <Row>
            <Col span={4} className='pdr-12'>
              <Form.Item name='name' label='Student name'>
                <Input />
              </Form.Item>
            </Col>
            <Col span={4} className='pdr-12'>
              <Form.Item name='mobile' label='Mobile'>
                <Input />
              </Form.Item>
            </Col>
            <Col span={4} className='pdr-12'>
              <Form.Item name='parentMobile' label='Parent mobile'>
                <Input />
              </Form.Item>
            </Col>
            <Col span={4} className='pdr-12'>
              <Form.Item name='active' valuePropName='checked' label='Status'>
                <Select allowClear>
                  <Select.Option value='true'>Active</Select.Option>
                  <Select.Option value='false'>Inactive</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type='primary' htmlType='submit'>
                Search
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </section>
  );
}

export default StudentSearch;