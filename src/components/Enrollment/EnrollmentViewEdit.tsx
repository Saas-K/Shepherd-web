import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { PageHeader, Card, Form, Select, Button, message, Row, Col, DatePicker, Switch, Modal, Input } from 'antd';
import moment from 'moment';
import { WarningOutlined } from "@ant-design/icons";

import { CREATE_ACTION, UPDATE_ACTION, VIEW_ACTION } from '../_common/core/constants';
import * as service from './core/service';
import * as courseService from '../Course/core/service';
import * as studentService from '../Student/core/service';
import { IEnrollment } from "./core/types";
import Label from "../_common/Label";
import { ICourse } from "../Course/core/types";
import { IPageResponse } from "../_common/core/types";
import { IStudent } from "../Student/core/types";
import ComponentLoading from "../_common/ComponentLoading";

const { Option } = Select;

export default function EnrollmentViewEdit() {
  const [form] = Form.useForm();
  const history = useHistory();
  const { pathname } = useLocation();
  const { id }: any = useParams();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

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
    setLoading(true);

    if (!id) {
      setLoading(false);
      return;
    };

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
    })
    .finally(() => {
      setLoading(false);
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
  
  const handleConfirmModalOk = async () => {
    const body: IEnrollment = {
      course: JSON.parse(form.getFieldValue('course')),
      student: JSON.parse(form.getFieldValue('student')),
      date: moment(form.getFieldValue('date')).utcOffset(420).format('yyyy-MM-DD'),
      active: form.getFieldValue('active'),
      sendNotification: form.getFieldValue('sendNotification')
    };
  
    setSubmitting(true);
    try {
      if (id) {
        await service.updateEnrollment(id, body);
      } else {
        await service.createEnrollment(body);
      }
      goBack();
      setSubmitting(false);
    } catch (error: any) {
      message.error(error.message);
    }
  };
  
  const getHeader = () => {
    if (!id) return 'Create Enrollment';
    return action === UPDATE_ACTION ? 'Edit Enrollment' : 'View Enrollment';
  };

  const getStudentDisplay = () => {
    const _student = JSON.parse(form.getFieldValue('student'));
    return `${_student.name} ${_student.mobile || ''} ${_student.parentMobile || ''}`;
  }

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

  const _renderConfirmModal = () => {
    if (form.getFieldValue('active')) {
      handleConfirmModalOk();
    } else {
      Modal.confirm({
        icon: <WarningOutlined />,
        title: 'WARNING, DEACTIVATING ENROLLMENT',
        content: <>
        <div>Student: {JSON.parse(form.getFieldValue('student')).name}</div>
        <div>Course: {JSON.parse(form.getFieldValue('course')).name}</div>
        <div>Once deactivated, this action cannot be undone.</div>
        <div>Are you sure to continue?</div>
        </>,
        onOk: handleConfirmModalOk,
      });
    }
  }

  return (
    loading ? <ComponentLoading /> :
    <>
      <PageHeader className='site-page-header' title={getHeader()} onBack={goBack} />
      <section>
        <Form className='form-create-campaign' form={form} layout='vertical'>
          <Card title='Enrollment' className='mb-6'>
            {
              action !== CREATE_ACTION && (
                <Form.Item
                  label={<Label title='Student' required />}
                >
                  <Input disabled value={getStudentDisplay()} />
                </Form.Item>
              )
            }
            <Form.Item
              hidden={action !== CREATE_ACTION}
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
            {
              action !== CREATE_ACTION && (
                <Form.Item
                  label={<Label title='Course' required />}
                >
                  <Input disabled value={JSON.parse(form.getFieldValue('course')).name} />
                </Form.Item>
              )
            }
            <Form.Item
              hidden={action !== CREATE_ACTION}
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
            <Form.Item name='sendNotification' valuePropName='checked' initialValue={form.getFieldValue('sendNotification') || true} label={<Label title='SMS' />}>
              <Switch disabled={action === VIEW_ACTION} checked={form.getFieldValue('sendNotification')} />
            </Form.Item>
            <Form.Item name='active' valuePropName='checked' initialValue={form.getFieldValue('active') || true} label={<Label title='Active' />}>
              <Switch disabled={action === VIEW_ACTION} checked={form.getFieldValue('active')} />
            </Form.Item>
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