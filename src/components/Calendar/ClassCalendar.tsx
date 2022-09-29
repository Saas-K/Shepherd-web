import React, { useEffect, useState, useRef } from 'react';
import { render } from 'react-dom';
import { Calendar, Modal, Button, Col, Form, Input, message, Descriptions, Space, Select, Collapse } from 'antd';
import type { Moment } from 'moment';
import moment from 'moment';
import FullCalendar, { EventApi, DateSelectArg, EventClickArg, EventContentArg, formatDate, ViewApi, CalendarApi } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ComponentLoading from '../common/ComponentLoading';

import { IDayClassInfo, IFullCalendarEvent, IClassSlot, IClassMeta } from './core/types';
import * as service from './core/service';
import { numberPadLeft, omitTimeSeconds } from '../../utils/StringUtils';
import { 
  getWeekDatesFormatted, 
  getFullCalendarTime, 
  getWeekDayName, 
  getWeekDayNow, 
  getYearMonth, 
  parseNumberYearMonthDate, 
  getFullCalendarDate,
  getPrevYearMonth,
  getNextYearMonth,
  compareYearMonth,
  compareYearMonthStr
} from '../../utils/DateTimeUtils';

export default function ClassCalendar() {
  const calendarRef: any = useRef(null);
  const weekDates: string[] = getWeekDatesFormatted(new Date());
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
  const [selectedSlot, setSelectedSlot] = useState<IClassSlot>();
  const [currentMonth, setCurrentMonth] = useState<string>('');
  const [originalClass, setOriginalClass] = useState<IDayClassInfo>();
  const [pendingAlt, setPendingAlt] = useState<IDayClassInfo>();

    // TODO:
    /**
     * alter main day class: drag/resize main day -> show update pop up -> confirm
     * cancel class: click class -> show pop up -> toggle cancel
     */

  useEffect(() => {
    const now: Date = new Date();
    setCurrentMonth(`${now.getFullYear}-${now.getMonth}`);

    const prevYearMonthParts: number[] = getPrevYearMonth(now);
    const nextYearMonthParts: number[] = getNextYearMonth(now);

    fetchData(prevYearMonthParts[0], prevYearMonthParts[1], nextYearMonthParts[0], nextYearMonthParts[1]);
  }, []);

  useEffect(() => {
    populateClasses();
  }, [datesInfo]);

  const fetchData = (beginYear: number, beginMonth: number, endYear: number, endMonth: number) => {
    service
    .getDays(beginYear, beginMonth, endYear, endMonth)
    .then((data: any) => {
      setDatesInfo((prev: any) => ({
          ...prev,
          ...data
      }));
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
      backgroundColor: 'green',
      extendedProps: {
        courseId: dayClass.courseId,
        courseName: dayClass.courseName,
        weekDay: dayClass.weekDay,
        begin: dayClass.begin,
        end: dayClass.end,
        mainDayClassId: dayClass.mainDayClassId,
        mainDayClassDate: dayClass.mainDayClassDate,
        date,
        active: dayClass.active
      }
    }
  }

  const handleClassInfoChange = (changeInfo: any) => {
    const _event: EventApi = changeInfo.event;
    const originalClass: IDayClassInfo | null = getOriginalClassInfo(_event.id);

    if (originalClass) {
      setOriginalClass(originalClass);
      setPendingAlt({
        id: originalClass?.mainDayClassDate ? originalClass.id : undefined, // if prev has main date (is alt) then alt's id else none (create new)
        courseId: originalClass?.courseId || undefined,
        weekDay: getWeekDayNow(_event?.start),
        begin: `${getFullCalendarTime(_event?.startStr)}:00`,
        end: `${getFullCalendarTime(_event?.endStr)}:00`,
        date: getFullCalendarDate(_event?.startStr),
        mainDayClassId: originalClass?.mainDayClassId || undefined,
        mainDayClassDate: originalClass?.mainDayClassDate || originalClass?.date, // if prev has main date (is alt) then return else origin's date
        active: true
      });
  
      setIsEventEditVisible(true);
    }
  }

  const getOriginalClassInfo = (id: string): IDayClassInfo | null => {
    const _parts: string[] = id.split('-');
    const _year = _parts[0];
    const _month = _parts[1];
    const _date = _parts[2];
    const _dayClassId = _parts[3];
    const fullDate = `${_year}-${_month}-${_date}`;

    const _dayClasses: IDayClassInfo[] = datesInfo[`${_year}-${_month}`][fullDate];
    for (const _dayClass of _dayClasses) {
      if (_dayClassId === _dayClass.id) {
        _dayClass.date = fullDate;
        return _dayClass;
      }
    }
    return null;
  }

  const handleAltSubmit = () => {
    let dateParts: number[] | null;
    if (pendingAlt) {
      service.createAltDay(pendingAlt)
      .then((data: any) => {
        setLoading(true);
        dateParts = parseNumberYearMonthDate(pendingAlt.date);
        if (dateParts) {
          const _originalClassParts: number[] | null = parseNumberYearMonthDate(originalClass?.date);
          const _pendingAltClassParts: number[] | null = parseNumberYearMonthDate(pendingAlt.date);

          if (_originalClassParts && _pendingAltClassParts) {
            const dateChangeCompare: number = compareYearMonthStr(originalClass?.date, pendingAlt.date);
            if (dateChangeCompare === 1) {
              fetchData(_originalClassParts[0], _originalClassParts[1], _pendingAltClassParts[0], _pendingAltClassParts[1]);
            } else if (dateChangeCompare === -1) {
              fetchData(_pendingAltClassParts[0], _pendingAltClassParts[1], _originalClassParts[0], _originalClassParts[1]);
            }
          }
        }
      })
      .catch(error => {
        message.error(error.message);
      })
      .finally(async () => {
        setSelectedSlot(undefined);
        setPendingAlt(undefined);
        setIsEventEditVisible(false);
        setLoading(false);
      });
    }
  }

  const handleDateChange = (dateInfo: any) => {
    const now: Date = new Date();
    const _curViewStart: Date = dateInfo.start;
    const _curViewEnd: Date = dateInfo.end;

    const _checkStart = compareYearMonth(now, _curViewStart);
    const _checkEnd = compareYearMonth(now, _curViewEnd);
    let _side = 0; // -1, 0, 1
    if (_checkStart === 1) {
      _side = 1;
    } else if (_checkEnd === -1) {
      _side = -1;
    } else return;

    let _reqBeginYear = 0;
    let _reqBeginMonth = 0;
    let _reqEndYear = 0;
    let _reqEndMonth = 0;
    if (_curViewStart.getMonth() !== _curViewEnd.getMonth()) {
      _reqBeginYear = _curViewStart.getFullYear();
      _reqBeginMonth = _curViewStart.getMonth() + 1;
      _reqEndYear = _curViewEnd.getFullYear();
      _reqEndMonth = _curViewEnd.getMonth() + 1;
    } else if (_side === -1) {
      const [_reqBeginYear, _reqBeginMonth] = getPrevYearMonth(_curViewStart);
      _reqEndYear = _curViewEnd.getFullYear();
      _reqEndMonth = _curViewEnd.getMonth() + 1;
    } else if (_side === 1) {
      const [_reqEndYear, _reqEndMonth] = getNextYearMonth(_curViewEnd);
      _reqBeginYear = _curViewStart.getFullYear();
      _reqBeginMonth = _curViewStart.getMonth() + 1;
    }

    const _validReqs = _reqBeginYear * _reqBeginMonth * _reqEndYear * _reqEndMonth !== 0;
    if (_validReqs 
      && (!datesInfo[getYearMonth(_reqBeginYear, _reqBeginMonth)] || !datesInfo[getYearMonth(_reqEndYear, _reqEndMonth)])) {
      fetchData(_reqBeginYear, _reqBeginMonth, _reqEndYear, _reqEndMonth);
    }
  }

  const _renderClasses = (classContent: EventContentArg) => {  
    return (
      <>
        {classContent.event.extendedProps.mainDayClassDate ? (<div>ALT</div>) : undefined}
        <b>{`${omitTimeSeconds(classContent.event.extendedProps.begin)} - ${omitTimeSeconds(classContent.event.extendedProps.end)}`}</b>
        <div>{classContent.event.title}</div>
        <div hidden>{classContent.event.id}</div>
      </>
    );
  }

  const _renderEditInput = () => {
    return (
      <>
        <Space direction='vertical' style={{ display: 'flex' }}>
          <div>Do you want to alter the class time?</div>
          <div>{pendingAlt?.courseName}</div>
          <div>{`${getWeekDayName(originalClass?.weekDay)} -> ${getWeekDayName(pendingAlt?.weekDay)}`}</div>
          <div>{`${originalClass?.begin} - ${originalClass?.end} -> ${pendingAlt?.begin} - ${pendingAlt?.end}`}</div>
          {/* {editMode === UPDATE ? (
            <Collapse>
            <Collapse.Panel header="Advanced" key="1">
              <Button onClick={handleDelete} danger>Delete</Button>
            </Collapse.Panel>
          </Collapse>
          ) : undefined} */}
        </Space>
      </>
    );
  }

  return (
    <>
      {loading ? (<ComponentLoading/>) : (
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
          }}
          initialView='timeGridWeek'
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

          eventContent={_renderClasses}
          events={classes}
          // select={this.handleDateSelect}
          // eventClick={this.handleEventClick}
          // eventsSet={this.handleEvents}
          eventChange={handleClassInfoChange}
          datesSet={handleDateChange}
        />
      )}
      <Modal 
        visible={isEventEditVisible}
        width='50%'
        confirmLoading={loading}
        okText={pendingAlt ? 'Confirm': UPDATE}
        onOk={pendingAlt ? handleAltSubmit : undefined}
        cancelText='Cancel'
        onCancel={() => {setIsEventEditVisible(false); setSelectedSlot(undefined); setPendingAlt(undefined)}}
      >
        {pendingAlt ? _renderEditInput() : undefined}
      </Modal>
    </>
  );
}