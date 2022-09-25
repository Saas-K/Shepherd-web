import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Modal, message, Select, Collapse, Button, Row, Space } from 'antd';
import FullCalendar, { EventApi, DateSelectArg, EventClickArg, EventContentArg, formatDate, ViewApi } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import moment from 'moment';
import { LabeledValue } from 'antd/lib/select';

import { IMainDay, IFullCalendarEvent, IClassSlot } from './core/types';
import * as service from './core/service';
import { numberPadLeft, omitTimeSeconds } from '../../utils/StringUtils';
import { getWeekDatesFormatted, getFullCalendarTime, getWeekDayName, getWeekDayNow } from '../../utils/DateTimeUtils';
import ComponentLoading from '../common/ComponentLoading';
import { colorsList } from '../../utils/Colors';
import { ICourse, IPageResponse } from '../common/core/types';

export default function ClassSchedule() {
  const weekDates: string[] = getWeekDatesFormatted(new Date());
  const CREATE = 'Create';
  const UPDATE = 'Update';
  
  const [loading, setLoading] = useState(true);
  const [isEventEditVisible, setIsEventEditVisible] = useState<boolean>(false); 
  const [classes, setClasses] = useState<IFullCalendarEvent[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<IClassSlot>();
  const [colorMap, setColorMap] = useState<Map<string, string | undefined>>(new Map());
  const [mainDayClass, setMainDayClass] = useState<IMainDay>();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [editMode, setEditMode] = useState<string>(CREATE);

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
    setEditMode(CREATE);
    setIsEventEditVisible(true);
  }

  const getCourseNameById = (id: string): string => {
    for (const course of courses) {
      if (id === course?.id) {
        return course?.name || '';
      }
    }
    return '';
  }

  const handleEventClick = (clickInfo: EventClickArg) => {
    const _event: EventApi = clickInfo.event;
    setSelectedSlot({
      id: _event.id,
      courseId: _event.extendedProps.courseId,
      weekDay: getWeekDayNow(_event?.start),
      startStr: getFullCalendarTime(_event.startStr),
      endStr: getFullCalendarTime(_event.endStr)
    });
    setEditMode(UPDATE);
    setIsEventEditVisible(true);
  }

  const getDefaultOptionValue = (): { value: string; label: string } => {
    const _courseId = selectedSlot?.courseId || classes.at(0)?.extendedProps?.courseId || '';
    return {
      value: _courseId,
      label: getCourseNameById(_courseId)
    };
  }

  const handleChangeCourseSelect = () => (value: { value: string; label: React.ReactNode }) => {
    setSelectedSlot((prev: any) => ({
      ...prev,
      'courseId': value.value
    }));
  }

  const handleEditSubmit = () => {
    service.createMainDay({
      id: selectedSlot?.id || undefined,
      courseId: selectedSlot?.courseId || courses.at(0)?.id,
      weekDay: selectedSlot?.weekDay,
      begin: `${selectedSlot?.startStr}:00`,
      end: `${selectedSlot?.endStr}:00`,
      active: true
    })
    .then((data: IMainDay) => {
      setLoading(true);
      data.courseName = getCourseNameById(data.courseId || '');

      if (editMode === CREATE) {
        setClasses([...classes, toFullCalendarEvent(data)]);
      } else {
        for (let i = 0; i < classes.length; i++) {
          if (classes[i].id === data.id) {
            classes[i] = toFullCalendarEvent(data);
          }
        }
        setClasses([...classes]);
      }
    })
    .catch(error => {
      message.error(error.message);
    })
    .finally(() => {
      setSelectedSlot(undefined);
      setIsEventEditVisible(false);
      setLoading(false);
    });
  }

  const handleClassInfoChange = (changeInfo: any) => {
    const _event: EventApi = changeInfo.event;
    service.createMainDay({
      id: _event?.id || undefined,
      courseId: _event?.extendedProps?.courseId || courses.at(0)?.id,
      weekDay: getWeekDayNow(_event?.start),
      begin: `${getFullCalendarTime(_event?.startStr)}:00`,
      end: `${getFullCalendarTime(_event?.endStr)}:00`,
      active: true
    })
    .then((data: IMainDay) => {
      setLoading(true);
      data.courseName = getCourseNameById(data.courseId || '');
      for (let i = 0; i < classes.length; i++) {
        if (classes[i].id === data.id) {
          classes[i] = toFullCalendarEvent(data);
        }
      }
      setClasses([...classes]);
    })
    .catch(error => {
      message.error(error.message);
    })
    .finally(() => {
      setSelectedSlot(undefined);
      setLoading(false);
    });
  }

  const handleDelete = () => {
    if (selectedSlot?.id) {
      service
      .deleteMainDay(selectedSlot.id)
      .then(() => {
        setLoading(true);
        const _classes: IFullCalendarEvent[] = [...classes];
        for (let i = 0; i < _classes.length; i++) {
          if (_classes.at(i)?.id === selectedSlot.id) {
            _classes.splice(i, 1);
            setClasses([..._classes]);
            break;
          }
        }
      })
      .catch(error => {
        message.error(error.message);
      })
      .finally(() => {
        setSelectedSlot(undefined);
        setIsEventEditVisible(false);
        setLoading(false);
      });
    }
  }

  const _renderClasses = (classContent: EventContentArg) => {
    return (
      <>
        <b>{`${omitTimeSeconds(classContent.event.extendedProps.begin)} - ${omitTimeSeconds(classContent.event.extendedProps.end)}`}</b>
        <div>{classContent.event.title}</div>
      </>
    );
  }

  const _renderCreateInput = () => {
    return (
      <>
        <Space direction='vertical' style={{ display: 'flex' }}>
          <div>{getWeekDayName(selectedSlot?.weekDay)}</div>
          <div>{`${selectedSlot?.startStr} - ${selectedSlot?.endStr}`}</div>
          <Select style={{ width: '50%' }} onChange={handleChangeCourseSelect()} labelInValue value={getDefaultOptionValue()}>
            {courses.map((course: ICourse) => (
              <Select.Option key={course.id} value={course.id} label={course.name}>{course.name}</Select.Option>
            ))}
          </Select>
          {editMode === UPDATE ? (
            <Collapse>
            <Collapse.Panel header="Advanced" key="1">
              <Button onClick={handleDelete} danger>Delete</Button>
            </Collapse.Panel>
          </Collapse>
          ) : undefined}
        </Space>
      </>
    );
  }

  return (
    <>
    {loading ? (<ComponentLoading/>) : (
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: undefined,
          center: undefined,
          right: undefined
        }}
        initialView='timeGridWeek'
        eventStartEditable
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
        // eventChange={function(){}}
        eventRemove={function(){}}
        */
        // eventsSet={() => console.log('shit')}
        eventChange={handleClassInfoChange}
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
        forceEventDuration
        defaultTimedEventDuration='00:30:00'
      />
    )}
      <Modal 
        visible={isEventEditVisible}
        width='50%'
        confirmLoading={loading}
        okText={editMode}
        onCancel={() => {setIsEventEditVisible(false); setSelectedSlot(undefined);}}
        onOk={handleEditSubmit}
      >
        {_renderCreateInput()}
      </Modal>
    </>
  );
}