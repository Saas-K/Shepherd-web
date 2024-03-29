import React from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row } from 'antd';
import moment from 'moment';
import TextArea from 'antd/lib/input/TextArea';

import { ICourseFilter } from './core/types';
import config from '../../_config';

const CourseSearch = ({ filter, onSearch }: { filter: any; onSearch: (values: ICourseFilter) => void }) => {
  const [form] = Form.useForm();

  return (
    <section>
      <Card>
        <Form
          form={form}
          onFinish={(values: ICourseFilter) => {
            onSearch({
              page: 1,
              limit: 10,
              name: values.name || undefined,
              description: values.description || undefined,
              startDateFrom: values.startDateFrom ? moment(values.startDateFrom).format(config.API_DATE_FORMAT) : undefined,
              startDateTo: values.startDateTo ? moment(values.startDateTo).format(config.API_DATE_FORMAT) : undefined,
            });
          }}
          layout='vertical'
        >
          <Row>
            <Col span={4}>
              <Form.Item name='startDateFrom' label='From start date'>
                <DatePicker placeholder='Select date' />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name='startDateTo' label='To start date'>
                <DatePicker placeholder='Select date' />
              </Form.Item>
            </Col>
            <Col span={4} className='pdr-12'>
              <Form.Item name='name' label='Course name'>
                <Input />
              </Form.Item>
            </Col>
            <Col span={4} className='pdr-12'>
              <Form.Item name='description' label='Description'>
                <TextArea />
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

export default CourseSearch;