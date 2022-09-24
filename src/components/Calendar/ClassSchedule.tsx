import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Calendar, Modal, Button, Col, Form, Input, message, TimePicker, Select } from 'antd';
// import type { Moment } from 'moment';
// import moment from 'moment';
// import ComponentLoading from '../common/ComponentLoading';

import FullCalendar, { EventApi, DateSelectArg, EventClickArg, EventContentArg, formatDate, ViewApi } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import moment from 'moment';

import { IMainDay, IFullCalendarEvent, IClassSlot } from './core/types';
import * as service from './core/service';
import { numberPadLeft, omitTimeSeconds } from '../../utils/StringUtils';
import { getWeekDatesFormatted, getFullCalendarTime, getWeekDayName } from '../../utils/DateTimeUtils';
import ComponentLoading from '../common/ComponentLoading';
import { colorsList } from '../../utils/Colors';
import { ICourse, IPageResponse } from '../common/core/types';

export default function ClassSchedule() {
  const weekDates: string[] = getWeekDatesFormatted(new Date());
  
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [isEventEditVisible, setIsEventEditVisible] = useState<boolean>(false); 
  const [classes, setClasses] = useState<IFullCalendarEvent[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<IClassSlot>();
  const [colorMap, setColorMap] = useState<Map<string, string | undefined>>(new Map());
  const [mainDayClass, setMainDayClass] = useState<IMainDay>();
  const [courses, setCourses] = useState<ICourse[]>([]);

  useEffect(() => {
    fetchData();
    fetchAllCourses();
  }, []);

  const fetchData = () => {
    service
    .getMainDays()
    .then((data: IMainDay[]) => {
      const _classes: IFullCalendarEvent[] = [];
      // let colorIndex = 0;
      for (const _class of data) {
        // if (_class.courseId && !colorMap.has(_class.courseId)) {
        //   colorMap.set(_class.courseId, colorsList.at(colorIndex));
        //   colorIndex++;
        // }

        _classes.push(toFullCalendarEvent(_class));
      }
      setClasses([..._classes]);
      // setColorMap({...colorMap});
    })
    .catch(error => {
      message.error(error.message);
    })
    .finally(() => {setLoading(false)});
  }

  const toFullCalendarEvent = (_class: IMainDay): IFullCalendarEvent => {
    return {
      id: _class.id,
      title: _class.courseName,
      start: getDate(_class.weekDay, _class.begin),
      end: getDate(_class.weekDay, _class.end),
      backgroundColor: 'blue',
      extendedProps: {
        courseId: _class.courseId,
        courseName: _class.courseName,
        weekDay: _class.weekDay,
        begin: _class.begin,
        end: _class.end
      }
    };
  }

  const fetchAllCourses = () => {
    service
    .getAllCourses()
    .then((data: IPageResponse<ICourse>) => {
      setCourses(data.list);
    })
    .catch(error => {
      message.error(error.message);
    });
  }

  const getDate = (weekDay: number | undefined, timeAt: string | undefined): string => {
    return weekDay && timeAt ? `${weekDates.at(weekDay - 1)}T${timeAt}` : '';
  }

  const handleDateSelect = (slotInfo: DateSelectArg) => {
    setSelectedSlot({
      weekDay: slotInfo.start.getDay(),
      start: slotInfo.start,
      end: slotInfo.end,
      startStr: getFullCalendarTime(slotInfo.startStr),
      endStr: getFullCalendarTime(slotInfo.endStr)
    });
    setIsEventEditVisible(true);
  }

  const handleEventClick = (clickInfo: EventClickArg) => {
    const _event: EventApi = clickInfo.event;

    setSelectedSlot({
      startStr: getFullCalendarTime(_event.startStr),
      endStr: getFullCalendarTime(_event.endStr)
    });
  }

  const handleChangeCourseSelect = () => (value: string) => {
    setSelectedSlot((prev: any) => ({
      ...prev,
      'courseId': value
    }));
  }

  const handleCreate = () => {
    service.createMainDay({
      courseId: selectedSlot?.courseId || courses.at(0)?.id,
      weekDay: selectedSlot?.weekDay,
      begin: `${selectedSlot?.startStr}:00`,
      end: `${selectedSlot?.endStr}:00`,
      active: true
    })
    .then((data: IMainDay) => {
      setLoading(true);
      for (const _class of classes) {
        if (data.courseId === _class.extendedProps?.courseId) {
          data.courseName = _class.extendedProps?.courseName;
        }
      }
      setClasses([...classes, toFullCalendarEvent(data)]);
    })
    .catch(error => {
      message.error(error.message);
    })
    .finally(() => {
      setIsEventEditVisible(false);
      setLoading(false);
    });
  }

  const _renderClasses = (classContent: EventContentArg) => {
    return (
      <>
        <b>{`${omitTimeSeconds(classContent.event.extendedProps.begin)}-${omitTimeSeconds(classContent.event.extendedProps.end)}`}</b>
        <div>{classContent.event.title}</div>
      </>
    );
  }

  const _renderCreateInput = () => {
    return (
      <>
        <div>{getWeekDayName(selectedSlot?.weekDay)}</div>
        <div>{`${selectedSlot?.startStr} - ${selectedSlot?.endStr}`}</div>
        <Select style={{ width: 120 }} onChange={handleChangeCourseSelect()}>
          {courses.map((course: ICourse) => (
            <Select.Option key={course.id} value={course.id}>{course.name}</Select.Option>
          ))}
        </Select>
      </>
    );
  }

  return (
    <>
    {console.log(classes.length)}
    {loading ? (<ComponentLoading/>) : (
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: undefined,
          center: undefined,
          right: undefined
        }}
        initialView='timeGridWeek'
        eventStartEditable={false}
        editable
        selectable
        selectMirror
        weekends
        firstDay={1}
        // initialEvents={} // alternatively, use the `events` setting to fetch from a feed
        select={handleDateSelect}
        eventClick={handleEventClick}
        // eventsSet={handleEvents} // called after events are initialized/added/changed/removed
        /* you can update a remote database when these fire:
        eventAdd={function(){}}
        eventChange={function(){}}
        eventRemove={function(){}}
        */
        eventAdd={() => {console.log('added')}}
        allDaySlot={false}
        dayHeaderContent={(args) => {
        return moment(args.date).format('ddd')
        }}
        slotDuration='00:15:00'
        slotLabelFormat={{hour: '2-digit', minute: '2-digit', hour12: false}}
        slotMinTime='06:00:00'
        slotMaxTime='22:00:00'
        initialEvents={classes}
        eventContent={_renderClasses}
      />
    )}
      <Modal 
        visible={isEventEditVisible}
        width='50%'
        confirmLoading={loading}
        okText='create'
        onCancel={() => {setIsEventEditVisible(false)}}
        onOk={handleCreate}
      >
        {_renderCreateInput()}
      </Modal>
    </>
  );
}