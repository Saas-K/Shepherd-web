import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { PageHeader, Card, Form, Input, Select, Button, message, Row, Col, DatePicker, InputNumber, Switch, Tag, Modal } from 'antd';
import moment from 'moment';
import { WarningOutlined } from "@ant-design/icons";

import { CREATE_ACTION, UPDATE_ACTION, VIEW_ACTION } from '../_common/core/constants';
import * as service from './core/service';
import { IColor, ICourse } from "./core/types";
import Label from "../_common/Label";
import config from '../../_config';
import { currency } from "../../utils/StringUtils";
import ComponentLoading from "../_common/ComponentLoading";

export default function CourseViewEdit() {
  const [form] = Form.useForm();
  const history = useHistory();
  const { pathname } = useLocation();
  const { id }: any = useParams();
  const pricePerClass = Form.useWatch('pricePerClass', form) || '0';
  const [colors, setColors] = useState<IColor[]>([]);
  const [loadingCourse, setLoadingCourse] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  let action = CREATE_ACTION;
  if (id) {
    action = pathname.indexOf('update') !== -1 ? UPDATE_ACTION : VIEW_ACTION;
  }

  useEffect(() => {
    fetchData();
    fetchColors();
  }, []);

  function fetchData() {
    setLoadingCourse(true);

    if (!id) {
      setLoadingCourse(false);
      return;
    }

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
    })
    .finally(() => {
      setLoadingCourse(false);
    });
  }

  function fetchColors() {
    setLoading(true);

    service
    .getAvailableColors()
    .then((res: IColor[]) => {
      setColors(res);
    })
    .catch(error => {
      message.error(error.message);
    })
    .finally(() => {
      setLoading(false);
    });
  }

  const goBack = () => {
    history.push('/course');
  };

  const handleConfirmModalOk = async () => {
    const body: ICourse = {
      name: form.getFieldValue('name'),
      startDate: moment(form.getFieldValue('startDate')).format(config.API_DATE_FORMAT),
      active: form.getFieldValue('active'),
      pricePerClass: form.getFieldValue('pricePerClass'),
      classPerWeek: form.getFieldValue('classPerWeek'),
      description: form.getFieldValue('description'),
      color: form.getFieldValue('color')
    };

    setSubmitting(true);
    try {
      if (id) {
        await service.updateCourse(id, body);
      } else {
        await service.createCourse(body);
      }
      goBack();
      setSubmitting(false);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const getHeader = () => {
    if (!id) return 'Create Course';
    return action === UPDATE_ACTION ? 'Edit Course' : 'View Course';
  };

  const _renderConfirmModal = () => {
    if (form.getFieldValue('active')) {
      handleConfirmModalOk();
    } else {
      Modal.confirm({
        icon: <WarningOutlined />,
        title: 'WARNING, DEACTIVATING COURSE',
        content: <>
        <div>Course: {form.getFieldValue('name')}</div>
        <div>Once deactivated, this action cannot be undone.</div>
        <div>Are you sure to continue?</div>
        </>,
        onOk: handleConfirmModalOk,
      });
    }
  }

  return (loadingCourse ? <ComponentLoading /> :
    <>
      <PageHeader className='site-page-header' title={getHeader()} onBack={goBack} />
      <section>
        <Form className='form-create-campaign' form={form} layout='vertical'>
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
            <Form.Item
              name='pricePerClass'
              label={<span><Label title='Price (per class)' required /><Label className='currency-label' title={`${currency(pricePerClass)} VND`}/></span>}
              rules={[
                {
                  required: true,
                  message: 'Price is required',
                },
              ]}
            >
              <InputNumber type='number' min={0} disabled={action === VIEW_ACTION} />
            </Form.Item>
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
              <InputNumber type='number' min={0} disabled={action === VIEW_ACTION} />
            </Form.Item>
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
            <Form.Item name='active' valuePropName='checked' initialValue={form.getFieldValue('active') || true} label={<Label title='Active' />}>
              <Switch disabled={action === VIEW_ACTION} checked={form.getFieldValue('active')} />
            </Form.Item>
            {loading ? <ComponentLoading /> : 
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
                {colors.map((color: IColor) => (
                  <Select.Option key={color.id} value={color.value} label={color.value} >
                    <Tag color={color.value}>{`\u200B\t\u200B\t\u200B\t\u200B ${color.usedBy ? '(used)' : ''}`}</Tag>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            }
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                {action !== VIEW_ACTION && (
                  <Button disabled={submitting} type='primary' htmlType='submit' onClick={_renderConfirmModal}>
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