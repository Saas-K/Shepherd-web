import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Calendar, Modal, Button, Col, Form, Input, message, Descriptions } from 'antd';
import type { Moment } from 'moment';
import moment from 'moment';
import ComponentLoading from '../common/ComponentLoading';

import { IDayClassInfo } from './core/types';
import * as service from './core/service';
import { numberPadLeft, omitTimeSeconds } from '../../utils/StringUtils';
import { getWeekDayName } from '../../utils/DateTimeUtils';

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
   */
  const [selectedClass, setSelectedClass] = useState<IDayClassInfo>();
  const [currentMonth, setCurrentMonth] = useState<string>('');

  useEffect(() => {
    const now: Date = new Date();
    fetchData(now.getFullYear(), now.getMonth() + 1, true);
  }, []);

  const fetchData = (year: number, month: number, init: boolean) => {
    service
    .getDays(year, month, init)
    .then((data: any) => {
      const initYearMonth: string = _getYearMonth(year, month);
      setEvents((prev: any) => ({
          ...prev,
          ...data
      }));
      setCurrentMonth(initYearMonth);
    })
    .catch(error => {
      message.error(error.message);
    })
    .finally(() => {setLoading(false)})
  }

  const _getYearMonth = (year: number, month: number): string => {
    return `${year}-${numberPadLeft(month)}`;
  }

  const getDateEvents = (value: Moment) => {
    const _month: any = events[value.format('YYYY-MM')];
    if (_month !== undefined) {
      const _events: any[] = _month[value.format('YYYY-MM-DD')];
      return _events !== undefined ? _events : [];
    }
    return [];
  }

  const renderDates = (value: Moment) => {
    return (
      <ul className='events'>
        {getDateEvents(value).map((e: IDayClassInfo) => (
          <li key={e.id} onClick={() => {
            _handleSelectClass(e, value.format('DD-MM-YYYY'));
            }}>
            <span className='calendar-time'>{`${omitTimeSeconds(e.begin)}`}</span>
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

  const _handleSelectDate = (value: Moment) => {
    console.log(currentMonth);
    console.log(value.format('YYYY-MM'));
    if (currentMonth !== value.format('YYYY-MM')) {
      fetchData(value.year(), value.month() + 1, false);
    }
    setSelectedDate(value.format('YYYY-MM-DD'));
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

  const _handleSelectClass = (classInfo: IDayClassInfo, date: string) => {
    classInfo.date = date;
    setSelectedClass(classInfo);
    setIsEventEditVisible(true);
  }

  const _renderClassInfo = () => {
    return (
      <>
        <Descriptions title={selectedClass?.courseName}>
          <Descriptions.Item label="" span={8}>
            {`${omitTimeSeconds(selectedClass?.begin)}-${omitTimeSeconds(selectedClass?.end)}`}
          </Descriptions.Item>
          <Descriptions.Item>
            {`${getWeekDayName(selectedClass?.weekDay)} ${selectedClass?.date}`}
          </Descriptions.Item>
        </Descriptions>
      </>
    );
  }

  return (
    <>
    {loading ? (<ComponentLoading/>) : (
      <>
      <Calendar dateCellRender={renderDates} onSelect={_handleSelectDate} />
      <Modal
        title='Response'
        visible={isEventEditVisible}
        onCancel={handleOk}
        onOk={handleOk}
      >
          {/* <Form
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
          </Form> */}
          {_renderClassInfo()}
      </Modal>
      </>
    )}
    </>
  );
}