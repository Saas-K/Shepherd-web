import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Switch } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';

import { IEnrollmentFilter } from './core/types';
import config from '../../_config';

const EnrollmentSearch = ({ filter, onSearch }: { filter: any; onSearch: (values: IEnrollmentFilter) => void }) => {
  const [form] = Form.useForm();

  return (
    <section>
      <Card>
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
          }}
          layout='vertical'
        >
          <Row>
            <Col span={4} className='pdr-12'>
              <Form.Item name='studentName' label='Student name'>
                <Input />
              </Form.Item>
            </Col>
            <Col span={4} className='pdr-12'>
              <Form.Item name='courseName' label='Course name'>
                <Input />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name='dateFrom' label='From date'>
                <DatePicker placeholder='Select date' />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name='dateTo' label='To date'>
                <DatePicker placeholder='Select date' />
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
            <Col span={4} className='pdr-12'>
              <Form.Item name='sendNotification' valuePropName='checked' label='SMS'>
                <Select allowClear>
                  <Select.Option value='true'>Yes</Select.Option>
                  <Select.Option value='false'>No</Select.Option>
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

export default EnrollmentSearch;