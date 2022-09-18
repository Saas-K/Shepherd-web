import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Badge, Calendar, Modal, Button, Col, Form, Input, Timeline, BadgeProps, message } from 'antd';
import type { Moment } from 'moment';
import moment from 'moment';
import ComponentLoading from '../common/ComponentLoading';

import { IDayClassInfo } from './core/types';
import * as service from './core/service';
import { numberPadLeft } from '../../utils/StringUtils';

export default function ClassesCalendar() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [isEventEditVisible, setIsEventEditVisible] = useState<boolean>(false); 
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [events, setEvents] = useState<any>({});
  /**
   * '2022-09': {
   *    '2022-09-09': [
   *        IDayClassInfo
   *    ]
   * }
   * 
   *  
   */

  useEffect(() => {
    const now: Date = new Date();
    fetchData(now.getFullYear(), now.getMonth() + 1);
  }, []);

  const fetchData = (year: number, month: number) => {
    service
    .getDays(year, month)
    .then((data: any) => {
      setEvents((prev: any) => ({
          ...prev,
          [`${year}-${numberPadLeft(month)}`]: data
      }));
    })
    .catch(error => {
      message.error(error.message);
    })
    .finally(() => {setLoading(false)})
  }

  const getDateEvents = (value: Moment) => {
    const _month: any = events[value.format('YYYY-MM')];
    if (_month !== undefined) {
      const _events: any[] = _month[value.format('YYYY-MM-DD')];
      console.log(_events);
      return _events !== undefined ? _events : [];
    }
    return [];
  }

  const renderDates = (value: Moment) => {
    return (
      <ul className='events'>
        {getDateEvents(value).map(e => (
          <li key={e.id}>
            <span className='calendar-time'>{`${e.begin.substring(0, 5)}`}</span>
            {e.active ? (<>{` ${e.courseName}`}</>) 
            : (<span className='crossed-out'>{` ${e.courseName}`}</span>)}
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
    {loading ? (<ComponentLoading/>) : (
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
    )}
    </>
  );
}