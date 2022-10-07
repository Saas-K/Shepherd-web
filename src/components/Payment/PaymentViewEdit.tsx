import { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { PageHeader, Card, Form, Input, Select, Button, message, Row, Col, DatePicker, InputNumber, Switch } from 'antd';
import moment from 'moment';

import { CREATE_ACTION, UPDATE_ACTION, VIEW_ACTION } from '../_common/core/constants';
import * as service from './core/service';
import { IPayment } from "./core/types";
import Label from "../_common/Label";
import config from '../../_config';

export default function PaymentViewEdit() {
  const [form] = Form.useForm();
  const history = useHistory();
  const { pathname } = useLocation();
  const { id }: any = useParams();

  let action = CREATE_ACTION;
  if (id) {
    action = pathname.indexOf('update') !== -1 ? UPDATE_ACTION : VIEW_ACTION;
  }

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {
    if (!id) return;
    service
    .getPayment(id)
    .then((res: IPayment) => {
      if (!form) return;
      form.setFieldsValue({
        enrollmentId: res.enrollmentId,
        sendNotification: res.sendNotification,
        courseId: res.courseId,
        courseName: res.courseName,
        studentId: res.studentId,
        studentName: res.studentName,
        price: res.price,
        date: moment(res.date),
        unpaid: res.unpaid,
        paidDate: moment(res.paidDate)
      });
    })
    .catch((error) => {
      message.error(error.message);
    });
  }

  const goBack = () => {
    history.push('/payment');
  };

  const onFinish = async (values: IPayment) => {
    const body: IPayment = {
      enrollmentId: values.enrollmentId,
      sendNotification: values.sendNotification,
      courseId: values.courseId,
      courseName: values.courseName,
      studentId: values.studentId,
      studentName: values.studentName,
      price: values.price,
      date: values.date,
      unpaid: values.unpaid,
      paidDate: values.paidDate
    };

    try {
      let response: any;
      if (id) {
        response = await service.updatePayment(id, body);
      } else {
        response = await service.createPayment(body);
      }
      goBack();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const getHeader = () => {
    if (!id) return 'Create Payment';
    return action === UPDATE_ACTION ? 'Edit Payment' : 'View Payment';
  };

  return (
    <>
      <PageHeader className='site-page-header' title={getHeader()} onBack={goBack} />
      <section className='mr-24'>
        <Form className='form-create-campaign' form={form} layout='vertical' onFinish={onFinish}>
          <Card title='Payment' className='mb-6'>
            <Form.Item
              name='courseName'
              label={<Label title='Course name' required />}
              rules={[
                {
                  required: true,
                  message: 'Course name date is required',
                },
              ]}
            >
              <Input disabled={action !== CREATE_ACTION} />
            </Form.Item>
            <Form.Item
              name='studentName'
              label={<Label title='Student name' required />}
              rules={[
                {
                  required: true,
                  message: 'Student name date is required',
                },
              ]}
            >
              <Input disabled={action !== CREATE_ACTION} />
            </Form.Item>
            <Form.Item
              name='price'
              label={<Label title='Price' required />}
              rules={[
                {
                  required: true,
                  message: 'Price is required',
                },
              ]}
            >
              <Input disabled={action !== CREATE_ACTION} />
            </Form.Item>
            <Form.Item
              name='date'
              label={<Label title='Notice date' required />}
              rules={[
                {
                  required: true,
                  message: 'Notice date is required',
                },
              ]}
            >
              <DatePicker placeholder='Select date' disabled={action !== CREATE_ACTION} />
            </Form.Item>
            <Form.Item
              name='paymentDate'
              label={<Label title='Payment date' required />}
              rules={[
                {
                  required: true,
                  message: 'Payment date is required',
                },
              ]}
            >
              <DatePicker placeholder='Select date' disabled={action === VIEW_ACTION} />
            </Form.Item>
            <Col span={6} className='pdr-12'>
              <Form.Item
                name='paid'
                label={<Label title='Paid' />}
              >
                <Input disabled={action === VIEW_ACTION} />
              </Form.Item>
            </Col>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                {action !== VIEW_ACTION && (
                  <Button type='primary' htmlType='submit'>
                    {action === UPDATE_ACTION ? 'Update' : 'Create'}
                  </Button>
                )}
              </Col>
            </Row>
          </Card>
        </Form>
      </section>
    </>
  );
}