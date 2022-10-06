import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Switch } from 'antd';
import moment from 'moment';

import { IPaymentFilter } from './core/types';
import config from '../../_config';

const PaymentSearch = ({ filter, onSearch }: { filter: any; onSearch: (values: IPaymentFilter) => void }) => {
  const [form] = Form.useForm();

  return (
    <section>
      <Card>
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
          }}
          layout='vertical'
        >
          <Row>
            <Col span={4} className='pdr-12'>
              <Form.Item name='courseName' label='Course name'>
                <Input />
              </Form.Item>
            </Col>
            <Col span={4} className='pdr-12'>
              <Form.Item name='studentName' label='Student name'>
                <Input />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name='dateFrom' label='From notice date'>
                <DatePicker placeholder='Select date' />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name='dateTo' label='To notice date'>
                <DatePicker placeholder='Select date' />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name='paidDateFrom' label='From paid date'>
                <DatePicker placeholder='Select date' />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name='paidDateTo' label='To paid date'>
                <DatePicker placeholder='Select date' />
              </Form.Item>
            </Col>
            <Col span={4} className='pdr-12'>
              <Form.Item name='paid' valuePropName='checked' label='Paid'>
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

export default PaymentSearch;