import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import type { BadgeProps } from 'antd';
import { Badge, Calendar, Modal, Button, Col, Form, Input } from 'antd';
import type { Moment } from 'moment';
import moment from 'moment';

export default function Page() {
  const [form] = Form.useForm();
  const [isEventEditVisible, setIsEventEditVisible] = useState<boolean>(false); 
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [events, setEvents] = useState<any>({
    '2022-09-09': [
      {type: 'success', content: 'test event 1'},
      {type: 'success', content: 'test event 2'},
    ],
    '2022-09-05': [
      {type: 'success', content: 'another test event'}
    ]
  });

  const getDateEvents = (value: Moment) => {
    const _events: any[] = events[value.format('YYYY-MM-DD')];
    return _events !== undefined ? _events : [];
  }

  const renderDates = (value: Moment) => {
    return (
      <ul className='events'>
        {getDateEvents(value).map(e => (
          <li key={e.content}>
            <Badge status={e.type as BadgeProps['status']} text={e.content} />
          </li>
        ))}
      </ul>
    );
  }

  const handleOk = () => {
    setIsEventEditVisible(false);
  };

  const onSelect = (value: Moment) => {
    setSelectedDate(value.format('YYYY-MM-DD'));
    // setEvents((prev: any) => (
    //   {
    //     ...prev,
    //     [value.format('YYYY-MM-DD')]: [{type: 'success', content: 'added event'}]
    //   }
    // ));
    setIsEventEditVisible(true);
  }

  const onFinish = (values: any) => {
    setEvents((prev: any) => (
      {
        ...prev,
        [selectedDate]: [{type: 'success', content: values.content}]
      }
    ));
    setIsEventEditVisible(false);
  }

  return (
    <>
    <Calendar dateCellRender={renderDates} onSelect={onSelect} />
    <Modal
      title='Response'
      visible={isEventEditVisible}
      onCancel={handleOk}
      onOk={handleOk}
    >
     <Col span={8} className='pdr-12'>
     <Form
      form={form}
      onFinish={onFinish}
      layout='vertical'
    >
      <Col span={8} className='pdr-12'>
        <Form.Item name='content' label='Event content'>
          <Input />
        </Form.Item>
      </Col>
      <Button
        onClick={() => {
          return setIsEventEditVisible(false);
        }}
        type='primary'
      >
        Cancel
      </Button>
      <Button type='primary' htmlType='submit'>
        Submit
      </Button>
    </Form>
      </Col>
    </Modal>
    </>
  );
}