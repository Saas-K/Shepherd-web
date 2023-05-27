import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { PageHeader, Card, Form, Select, Button, message, Row, Col, DatePicker, Switch } from 'antd';
import moment from 'moment';

import { CREATE_ACTION, UPDATE_ACTION, VIEW_ACTION } from '../_common/core/constants';
import * as service from './core/service';
import * as courseService from '../Course/core/service';
import * as studentService from '../Student/core/service';
import { IEnrollment } from "./core/types";
import Label from "../_common/Label";
import { ICourse } from "../Course/core/types";
import { IPageResponse } from "../_common/core/types";
import { IStudent } from "../Student/core/types";

const { Option } = Select;

export default function EnrollmentViewEdit() {
  const [form] = Form.useForm();
  const history = useHistory();
  const { pathname } = useLocation();
  const { id }: any = useParams();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [students, setStudents] = useState<IStudent[]>([]);

  let action = CREATE_ACTION;
  if (id) {
    action = pathname.indexOf('update') !== -1 ? UPDATE_ACTION : VIEW_ACTION;
  }

  useEffect(() => {
    fetchData();
    fetchAllActiveCourses();
    fetchAllActiveStudents();
  }, []);

  function fetchData() {
    if (!id) return;
    service
    .getEnrollment(id)
    .then((res: IEnrollment) => {
      if (!form) return;
      form.setFieldsValue({
        course: JSON.stringify(res.course),
        student: JSON.stringify(res.student),
        date: moment(res.date),
        active: res.active,
        sendNotification: res.sendNotification
      });
    })
    .catch((error) => {
      message.error(error.message);
    });
  }

  function fetchAllActiveCourses() {
    courseService
    .getAllActiveCourses()
    .then((data: IPageResponse<ICourse>) => {
      setCourses(data.list);
    })
    .catch(error => {
      message.error(error.message);
    });
  }

  function fetchAllActiveStudents() {
    studentService
    .getAllActiveStudents()
    .then((data: IPageResponse<IStudent>) => {
      setStudents(data.list);
    })
    .catch(error => {
      message.error(error.message);
    });
  }

  const goBack = () => {
    history.push('/enrollment');
  };

  const onFinish = async (values: any) => {
    const body: IEnrollment = {
      course: JSON.parse(values.course),
      student: JSON.parse(values.student),
      date: values.date,
      active: values.active,
      sendNotification: values.sendNotification
    };

    try {
      if (id) {
        await service.updateEnrollment(id, body);
      } else {
        await service.createEnrollment(body);
      }
      goBack();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const getHeader = () => {
    if (!id) return 'Create Enrollment';
    return action === UPDATE_ACTION ? 'Edit Enrollment' : 'View Enrollment';
  };

  const _renderStudentOptions = () => {
    return students.map((student: IStudent) => {
      return (
        <Option key={student.id} value={JSON.stringify(student)}>
          {`${student.name} ${student.mobile || ''} ${student.parentMobile || ''}`}
        </Option>
      );
    });
  }

  const _renderCourseOptions = () => {
    return courses.map((course: ICourse) => {
      return (
        <Option key={course.id} value={JSON.stringify(course)}>
          {`${course.name}`}
        </Option>
      );
    });
  }

  return (
    <>
      <PageHeader className='site-page-header' title={getHeader()} onBack={goBack} />
      <section className='mr-24'>
        <Form className='form-create-campaign' form={form} layout='vertical' onFinish={onFinish}>
          <Card title='Enrollment' className='mb-6'>
            <Form.Item
              name='student'
              label={<Label title='Student' required />}
              rules={[
                {
                  required: true,
                  message: 'Student is required',
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Student"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
                disabled={action !== CREATE_ACTION}
              >
                {_renderStudentOptions()}
              </Select>
            </Form.Item>
            <Form.Item
              name='course'
              label={<Label title='Course' required />}
              rules={[
                {
                  required: true,
                  message: 'Course is required',
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Course"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
                disabled={action !== CREATE_ACTION}
              >
                {_renderCourseOptions()}
              </Select>
            </Form.Item>
            <Col span={6} className='pdr-12'>
              <Form.Item
                name='date'
                label={<Label title='Date' required/>}
                rules={[
                  {
                    required: true,
                    message: 'Date is required',
                  },
                ]}
              >
                <DatePicker format='DD/MM/YYYY' disabled={action === VIEW_ACTION}/>
              </Form.Item>
            </Col>
            <Col span={6} className='pdr-12'>
              <Form.Item name='sendNotification' valuePropName='checked' label={<Label title='SMS' />}>
                <Switch disabled={action === VIEW_ACTION} defaultChecked />
              </Form.Item>
            </Col>
            <Col span={6} className='pdr-12'>
              <Form.Item name='active' valuePropName='checked' label={<Label title='Active' />}>
                <Switch disabled={action === VIEW_ACTION} defaultChecked />
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