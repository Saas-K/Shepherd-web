import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { PageHeader, Card, Form, Input, Select, Button, message, Row, Col, DatePicker, Switch, FormListFieldData } from 'antd';
import moment from 'moment';

import { CREATE_ACTION, UPDATE_ACTION, VIEW_ACTION } from '../_common/core/constants';
import * as service from './core/service';
import * as enrollmentService from '../Enrollment/core/service';
import { IPayment } from "./core/types";
import Label from "../_common/Label";
import config from '../../_config';
import { IPageResponse } from "../_common/core/types";
import { IEnrollment } from "../Enrollment/core/types";
import { currency } from "../../utils/StringUtils";

export default function PaymentViewEdit() {
  const [form] = Form.useForm();
  const history = useHistory();
  const { pathname } = useLocation();
  const { id }: any = useParams();
  const [enrollments, setEnrollments] = useState<IEnrollment[]>([]);
  const price = Form.useWatch<string>('price', form) || '0';
  const paid = Form.useWatch<string>('paid', form) || '0';

  let action = CREATE_ACTION;
  if (id) {
    action = pathname.indexOf('update') !== -1 ? UPDATE_ACTION : VIEW_ACTION;
  }

  useEffect(() => {
    fetchData();
    fetchAllEnrollments();
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

  function fetchAllEnrollments() {
    enrollmentService
    .getAllEnrollments()
    .then((data: IPageResponse<IEnrollment>) => {
      setEnrollments(data.list);
    })
    .catch(error => {
      message.error(error.message);
    });
  }

  const goBack = () => {
    history.push('/payment');
  };

  const onFinish = async (values: IPayment) => {
    try {
      if (action === CREATE_ACTION && values.enrollment) {
        const body: IPayment = {
          enrollment: JSON.parse(values.enrollment),
          date: moment(values.date).format(config.API_DATE_FORMAT),
          unpaid: values.unpaid,
          paidDate: moment(values.paidDate).format(config.API_DATE_FORMAT)
        }
        await service.createPayment(body);
      } else {
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
          paidDate: moment(values.paidDate).format(config.API_DATE_FORMAT)
        };
  
        await service.updatePayment(id, body);
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

  const _renderEnrollmentOptions = () => {
    return enrollments.map((enrollment: IEnrollment) => {
      return (
        <Select.Option key={enrollment.id} value={JSON.stringify(enrollment)}>
          {`${enrollment.course.name} ${enrollment.student.name}`}
        </Select.Option>
      );
    });
  }

  return (
    <>
      <PageHeader className='site-page-header' title={getHeader()} onBack={goBack} />
      <section>
        <Form className='form-create-campaign' form={form} layout='vertical' 
          onFinish={onFinish}>
          <Card title='Enrollment' className='mb-6'>
            <Form.Item hidden={action !== CREATE_ACTION}
              name='enrollment'
              label={<Label title='Enrollment' required />}
              rules={[
                {
                  required: true,
                  message: 'Enrollment is required',
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Enrollment"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
              >
                {_renderEnrollmentOptions()}
              </Select>
            </Form.Item>
            <Form.Item hidden={action === CREATE_ACTION}
              name='courseName'
              label={<Label title='Course name' required={action !== CREATE_ACTION} />}
              rules={[
                {
                  required: action !== CREATE_ACTION,
                  message: 'Course name date is required',
                },
              ]}
            >
              <Input disabled={action !== CREATE_ACTION} />
            </Form.Item>
            <Form.Item hidden={action === CREATE_ACTION}
              name='studentName'
              label={<Label title='Student name' required={action !== CREATE_ACTION} />}
              rules={[
                {
                  required: action !== CREATE_ACTION,
                  message: 'Student name date is required',
                },
              ]}
            >
              <Input disabled={action !== CREATE_ACTION} />
            </Form.Item>
            <Form.Item
              name='price'
              label={<span><Label title='Price' required /><Label className='currency-label' title={`${currency(price)} VND`} /></span>}
              rules={[
                {
                  required: true,
                  message: 'Price is required',
                },
              ]}
            >
              <Input type='number' min={0} disabled={action !== CREATE_ACTION} />
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
              <DatePicker format='DD/MM/YYYY' disabled={action !== CREATE_ACTION} />
            </Form.Item>
            <Form.Item
              name='paymentDate'
              label={<Label title='Payment date' />}
            >
              <DatePicker placeholder='Select date' disabled={action === VIEW_ACTION} />
            </Form.Item>
            <Form.Item
              name='paid'
              label={<span><Label title='Paid' required /><Label className='currency-label' title={`${currency(paid)} VND`} /></span>}
            >
              <Input type='number' disabled={action === VIEW_ACTION} />
            </Form.Item>
            <Form.Item name='sendNotification' valuePropName='checked' label={<Label title='SMS' />}>
              <Switch disabled={action === VIEW_ACTION} defaultChecked />
            </Form.Item>
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