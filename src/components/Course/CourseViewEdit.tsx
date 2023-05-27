import React, { useEffect } from "react";
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { PageHeader, Card, Form, Input, Select, Button, message, Row, Col, DatePicker, InputNumber, Switch, Tag } from 'antd';
import moment from 'moment';

import { CREATE_ACTION, UPDATE_ACTION, VIEW_ACTION } from '../_common/core/constants';
import * as service from './core/service';
import { ICourse } from "./core/types";
import Label from "../_common/Label";
import config from '../../_config';
import { colorsList } from '../../utils/Colors';

export default function CourseViewEdit() {
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
    .getCourse(id)
    .then((res: ICourse) => {
      if (!form) return;
      form.setFieldsValue({
        name: res.name,
        startDate: moment(res.startDate),
        active: res.active,
        pricePerClass: res.pricePerClass,
        classPerWeek: res.classPerWeek,
        description: res.description,
        color: res.color
      });
    })
    .catch((error) => {
      message.error(error.message);
    });
  }

  const goBack = () => {
    history.push('/course');
  };

  const onFinish = async (values: ICourse) => {
    const body: ICourse = {
      name: values.name,
      startDate: moment(values.startDate).format(config.API_DATE_FORMAT),
      active: values.active,
      pricePerClass: values.pricePerClass,
      classPerWeek: values.classPerWeek,
      description: values.description,
      color: values.color
    };

    try {
      if (id) {
        await service.updateCourse(id, body);
      } else {
        await service.createCourse(body);
      }
      goBack();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const getHeader = () => {
    if (!id) return 'Create Course';
    return action === UPDATE_ACTION ? 'Edit Course' : 'View Course';
  };

  return (
    <>
      <PageHeader className='site-page-header' title={getHeader()} onBack={goBack} />
      <section className='mr-24'>
        <Form className='form-create-campaign' form={form} layout='vertical' onFinish={onFinish}>
          <Card title='Course' className='mb-6'>
            <Form.Item
              name='name'
              label={<Label title='Course name' required />}
              rules={[
                {
                  required: true,
                  message: 'Course name is required',
                },
              ]}
            >
              <Input disabled={action === VIEW_ACTION} />
            </Form.Item>
            <Col span={6} className='pdr-12'>
              <Form.Item
                name='pricePerClass'
                label={<Label title='Price (per class)' required />}
                rules={[
                  {
                    required: true,
                    message: 'Price is required',
                  },
                ]}
              >
                <InputNumber min={0} disabled={action === VIEW_ACTION} />
              </Form.Item>
            </Col>
            <Col span={6} className='pdr-12'>
              <Form.Item
                name='classPerWeek'
                label={<Label title='Classes (per week)' required />}
                rules={[
                  {
                    required: true,
                    message: 'Classes is required',
                  },
                ]}
              >
                <InputNumber min={0} disabled={action === VIEW_ACTION} />
              </Form.Item>
            </Col>
            <Form.Item
              name='description'
              label={<Label title='Description' required />}
              rules={[
                {
                  required: true,
                  message: 'Description is required',
                },
              ]}
            >
              <Input.TextArea disabled={action === VIEW_ACTION} />
            </Form.Item>
            <Row>
              <Col span={6} className='pdr-12'>
                <Form.Item
                  name='startDate'
                  label={<Label title='Start date' required />}
                  rules={[
                    {
                      required: true,
                      message: 'Start date is required',
                    },
                  ]}
                >
                  <DatePicker format='DD/MM/YYYY' disabled={action === VIEW_ACTION} />
                </Form.Item>
              </Col>
              <Col span={6} className='pdr-12'>
                <Form.Item name='active' valuePropName='checked' label={<Label title='Active' />}>
                  <Switch disabled={action === VIEW_ACTION} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name='color'
              label={<Label title='Color' required />}
              rules={[
                {
                  required: true,
                  message: 'Color is required',
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Color"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
                disabled={action === VIEW_ACTION}
              >
                {colorsList.map((color: string) => (
                  <Select.Option key={color} value={color} label={color}><Tag color={color}>some text</Tag></Select.Option>
                ))}
              </Select>
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