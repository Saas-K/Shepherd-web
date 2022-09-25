import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Calendar, Modal, Button, Col, Form, Input, message, Descriptions } from 'antd';
import type { Moment } from 'moment';
import moment from 'moment';
import FullCalendar, { EventApi, DateSelectArg, EventClickArg, EventContentArg, formatDate, ViewApi } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ComponentLoading from '../common/ComponentLoading';

import { IDayClassInfo, IFullCalendarEvent } from './core/types';
import * as service from './core/service';
import { numberPadLeft, omitTimeSeconds } from '../../utils/StringUtils';
import { getWeekDatesFormatted, getFullCalendarTime, getWeekDayName, getWeekDayNow, getYearMonth, getDate } from '../../utils/DateTimeUtils';

export default function ClassCalendar() {
  const weekDates: string[] = getWeekDatesFormatted(new Date());
  const CREATE = 'Create';
  const UPDATE = 'Update';
  
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [isEventEditVisible, setIsEventEditVisible] = useState<boolean>(false); 
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [datesInfo, setDatesInfo] = useState<any>({});
  /**
   * '2022-09': {
   *    '2022-09-09': [
   *        IDayClassInfo
   *    ]
   * }
   */
  const [classes, setClasses] = useState<IFullCalendarEvent[]>([]);
  const [selectedClass, setSelectedClass] = useState<IDayClassInfo>();
  const [currentMonth, setCurrentMonth] = useState<string>('');

  useEffect(() => {
    const now: Date = new Date();
    fetchData(now.getFullYear(), now.getMonth() + 1, true);
  }, []);

  useEffect(() => {
    populateClasses();
  }, [datesInfo]);

  const fetchData = (year: number, month: number, init: boolean) => {
    service
    .getDays(year, month, init)
    .then((data: any) => {
      const initYearMonth: string = getYearMonth(year, month);
      setDatesInfo((prev: any) => ({
          ...prev,
          ...data
      }));
      setCurrentMonth(initYearMonth);
    })
    .catch(error => {
      message.error(error.message);
    })
    .finally(async () => {
      setLoading(false);
    })
  }

  const populateClasses = (): void => {
    const _classes: IFullCalendarEvent[] = [];
    let i = 0;
    for (const value of Object.values(datesInfo) as Map<string, any>[]) {
      for (const [date, dayClasses] of Object.entries(value) as [string, IDayClassInfo[]][]) {
        if (dayClasses.length === 0) continue;

        const curDateClasses: IFullCalendarEvent[] = [];
        for (const _classInfo of dayClasses) {
          const _id = `${date}-${_classInfo.id}-${i++}`;
          curDateClasses.push(toFullCalendarEvent(_id, date, _classInfo));
        }
        _classes.push(...curDateClasses);
      }
    }
    setClasses([..._classes]);
  }

  const toFullCalendarEvent = (id: string, date: string, dayClass: IDayClassInfo): IFullCalendarEvent => {
    return {
      id,
      title: dayClass.courseName,
      start: `${date}T${dayClass.begin}`,
      end: `${date}T${dayClass.end}`,
      backgroundColor: 'blue',
      extendedProps: {
        courseId: dayClass.courseId,
        courseName: dayClass.courseName,
        weekDay: dayClass.weekDay,
        begin: dayClass.begin,
        end: dayClass.end,
        mainDayClassId: dayClass.mainDayClassId,
        mainDayClassDate: dayClass.mainDayClassDate,
        date: dayClass.date,
        active: dayClass.active
      }
    }
  }

  return (
    <>
      {loading ? (<ComponentLoading/>) : (
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
          }}
          initialView='timeGridWeek'
          eventStartEditable={false}
          editable
          selectable
          selectMirror
          weekends
          firstDay={1}
          allDaySlot={false}
          slotDuration='00:15:00'
          slotLabelFormat={{hour: '2-digit', minute: '2-digit', hour12: false}}
          slotMinTime='06:00:00'
          slotMaxTime='22:00:00'

          events={classes}
          // select={this.handleDateSelect}
          // eventContent={renderEventContent}
          // eventClick={this.handleEventClick}
          // eventsSet={this.handleEvents}
          // eventChange={handleClassInfoChange}
        />
      )}
    </>
  );
}