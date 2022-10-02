import { Button, Card, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import moment from 'moment';
import { SearchOutlined } from '@ant-design/icons';

import { ICourseFilter } from './core/types';
import config from '../../_config';

const CourseSearch = ({ filter, onSearch }: { filter: any; onSearch: (values: ICourseFilter) => void }) => {
  const [form] = Form.useForm();

  return (
    <section className='mr-24'>
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
            <Col span={4} className='pdr-12'>
              <Form.Item name='startDateFrom' label='From start date'>
                <DatePicker placeholder='Select date' />
              </Form.Item>
            </Col>
            <Col span={4} className='pdr-12'>
              <Form.Item name='startDateTo' label='To start date'>
                <DatePicker placeholder='Select date' />
              </Form.Item>
            </Col>
            
          </Row>
          <Row>
            <Col span={4} className='pdr-12'>
              <Form.Item name='name' label='Course name'>
                <Input />
              </Form.Item>
            </Col>
            <Col span={4} className='pdr-12'>
              <Form.Item name='description' label='Description'>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Button type='primary' htmlType='submit'>
              <SearchOutlined />
            </Button>
          </Row>
        </Form>
      </Card>
    </section>
  );
}

export default CourseSearch;