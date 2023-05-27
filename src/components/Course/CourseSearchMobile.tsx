import React, { useState } from 'react';
import { Avatar, Badge, Button, Col, DatePicker, Form, Input, Modal } from 'antd';
import moment from 'moment';
import { FilterOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';

import { ICourseFilter } from './core/types';
import config from '../../_config';
import { countFilter } from '../../utils/Misc';

const CourseSearchMobile = ({ filter, onSearch }: { filter: any; onSearch: (values: ICourseFilter) => void }) => {
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
          onFinish={(values: ICourseFilter) => {
            onSearch({
              page: 1,
              limit: 10,
              name: values.name || undefined,
              description: values.description || undefined,
              startDateFrom: values.startDateFrom ? moment(values.startDateFrom).format(config.API_DATE_FORMAT) : undefined,
              startDateTo: values.startDateTo ? moment(values.startDateTo).format(config.API_DATE_FORMAT) : undefined,
            });
            setFilterCount(countFilter(form));
            setShow(false);
          }}
          layout='vertical'
        >
          <Form.Item name='startDateFrom' label='From start date'>
            <DatePicker placeholder='Select date' />
          </Form.Item>
          <Form.Item name='startDateTo' label='To start date'>
            <DatePicker placeholder='Select date' />
          </Form.Item>
          <Form.Item name='name' label='Course name'>
            <Input />
          </Form.Item>
          <Form.Item name='description' label='Description'>
            <TextArea />
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

export default CourseSearchMobile;