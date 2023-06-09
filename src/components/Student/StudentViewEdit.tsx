import React, { useEffect } from "react";
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { PageHeader, Card, Form, Input, Button, message, Row, Col, Switch } from 'antd';

import { CREATE_ACTION, UPDATE_ACTION, VIEW_ACTION } from '../_common/core/constants';
import * as service from './core/service';
import { IStudent } from "./core/types";
import Label from "../_common/Label";

export default function StudentViewEdit() {
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
    .getStudent(id)
    .then((res: IStudent) => {
      if (!form) return;
      form.setFieldsValue({
        name: res.name,
        mobile: res.mobile,
        parentMobile: res.parentMobile,
        note: res.note,
        active: res.active
      });
    })
    .catch((error) => {
      message.error(error.message);
    });
  }

  const goBack = () => {
    history.push('/student');
  };

  const onFinish = async (values: IStudent) => {
    const body: IStudent = {
      name: values.name,
      mobile: values.mobile,
      parentMobile: values.parentMobile,
      note: values.note,
      active: values.active
    };

    try {
      if (id) {
        await service.updateStudent(id, body);
      } else {
        await service.createStudent(body);
      }
      goBack();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const getHeader = () => {
    if (!id) return 'Create Student';
    return action === UPDATE_ACTION ? 'Edit Student' : 'View Student';
  };

  return (
    <>
      <PageHeader className='site-page-header' title={getHeader()} onBack={goBack} />
      <section>
        <Form className='form-create-campaign' form={form} layout='vertical' onFinish={onFinish}>
          <Card title='Student' className='mb-6'>
            <Form.Item
              name='name'
              label={<Label title='Student name' required />}
              rules={[
                {
                  required: true,
                  message: 'Student name is required',
                },
              ]}
            >
              <Input disabled={action === VIEW_ACTION} />
            </Form.Item>
            <Col span={6} className='pdr-12'>
              <Form.Item
                name='mobile'
                label={<Label title='Mobile' />}
              >
                <Input disabled={action === VIEW_ACTION} />
              </Form.Item>
            </Col>
            <Col span={6} className='pdr-12'>
              <Form.Item
                name='parentMobile'
                label={<Label title='Parent mobile' />}
              >
                <Input disabled={action === VIEW_ACTION} />
              </Form.Item>
            </Col>
            <Form.Item
              name='note'
              label={<Label title='Note' />}
            >
              <Input.TextArea disabled={action === VIEW_ACTION} />
            </Form.Item>
            <Row>
              <Col span={6} className='pdr-12'>
                <Form.Item name='active' valuePropName='checked' label={<Label title='Active' />}>
                  <Switch disabled={action === VIEW_ACTION} defaultChecked />
                </Form.Item>
              </Col>
            </Row>
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