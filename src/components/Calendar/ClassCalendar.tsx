import React, { useEffect, useState, useRef } from 'react';
import { Modal, message, Space } from 'antd';
import FullCalendar, { EventApi, EventChangeArg, EventClickArg, EventContentArg } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ComponentLoading from '../_common/ComponentLoading';

import { IDayClassInfo, IFullCalendarEvent } from './core/types';
import * as service from './core/service';
import { omitTimeSeconds } from '../../utils/StringUtils';
import { 
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
  
  const [loading, setLoading] = useState(true);
  const [isEventEditVisible, setIsEventEditVisible] = useState<boolean>(false); 
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
  const [, setCurrentMonth] = useState<string>('');
  const [viewDate, setViewDate] = useState<Date[]>(); // [start, end]
  const [originalClass, setOriginalClass] = useState<IDayClassInfo>();
  const [pendingAlt, setPendingAlt] = useState<IDayClassInfo>();
  const [currenDate, setCurrentDate] = useState<Date>(new Date());

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

  function fetchData(beginYear: number, beginMonth: number, endYear: number, endMonth: number) {
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

  function populateClasses(): void {
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

  function toFullCalendarEvent(id: string, date: string, dayClass: IDayClassInfo): IFullCalendarEvent {
    return {
      id,
      title: dayClass.courseName,
      start: `${date}T${dayClass.begin}`,
      end: `${date}T${dayClass.end}`,
      backgroundColor: dayClass.color,
      extendedProps: {
        courseId: dayClass.courseId,
        courseName: dayClass.courseName,
        weekDay: dayClass.weekDay,
        begin: dayClass.begin,
        end: dayClass.end,
        mainDayClassId: dayClass.mainDayClassId,
        mainDayClassDate: dayClass.mainDayClassDate,
        date,
        active: dayClass.active,
        color: dayClass.color
      }
    }
  }

  const handleClassInfoChange = (changeInfo: EventChangeArg) => {
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

  function getOriginalClassInfo(id: string): IDayClassInfo | null {
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
    let _pendingAltClassParts: number[] | null;
    if (pendingAlt) {
      if (pendingAlt.date) {
        setCurrentDate(new Date(pendingAlt.date));
      }

      service.createAltDay(pendingAlt)
      .then((data: any) => {
        setLoading(true);
        _pendingAltClassParts = parseNumberYearMonthDate(pendingAlt.date);
        if (_pendingAltClassParts) {
          const _originalClassParts: number[] | null = parseNumberYearMonthDate(originalClass?.date);

          if (_originalClassParts && _pendingAltClassParts) {
            const dateChangeCompare: number = compareYearMonthStr(originalClass?.date, pendingAlt.date);
            if (dateChangeCompare === 1) {
              fetchData(_pendingAltClassParts[0], _pendingAltClassParts[1], _originalClassParts[0], _originalClassParts[1]);
            } else if (dateChangeCompare === -1) {
              fetchData(_originalClassParts[0], _originalClassParts[1], _pendingAltClassParts[0], _pendingAltClassParts[1]);
            } else if (viewDate) {
              fetchData(viewDate[0].getFullYear(), viewDate[0].getMonth() + 1, viewDate[1].getFullYear(), viewDate[1].getMonth() + 1);
            }
          }
        }
      })
      .catch(error => {
        message.error(error.message);
        setClasses([...classes]);
      })
      .finally(async () => {
        setPendingAlt(undefined);
        setIsEventEditVisible(false);
        setLoading(false);
      });
    }
  }

  const handleDateChange = (dateInfo: any) => {
    setViewDate([...[dateInfo.start, dateInfo.end]]);

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

  const handleEventClick = (clickInfo: EventClickArg) => {
    const _event: EventApi = clickInfo.event;
    setSelectedClass({
      id: _event.id,
      courseId: _event.extendedProps.courseId,
      courseName: _event.extendedProps.courseName,
      weekDay: _event.extendedProps.weekDay,
      begin: _event.extendedProps.begin,
      end: _event.extendedProps.end,
      mainDayClassId: _event.extendedProps.mainDayClassId,
      mainDayClassDate: _event.extendedProps.mainDayClassDate,
      date: _event.extendedProps.date,
      active: _event.extendedProps.active,
      color: _event.extendedProps.color
    });
    setIsEventEditVisible(true);
  }

  const handleToggleCancelSubmit = () => {
    if (selectedClass) {
      const _parsedId = selectedClass.id?.split('-')[3];
      if (selectedClass.date) {
        setCurrentDate(new Date(selectedClass.date));
      }

      service.toggleCancelClass({
        mainDayClassId: selectedClass?.mainDayClassDate ? selectedClass.mainDayClassId : _parsedId,
        mainDayClassDate: selectedClass?.mainDayClassDate || selectedClass?.date,
        altDayClassId: selectedClass?.mainDayClassDate && selectedClass.id ? _parsedId : null,
        canceled: selectedClass?.active
      })
      .then((data: any) => {
        setLoading(true);
        const _mainClassParts: number[] | null = parseNumberYearMonthDate(selectedClass?.mainDayClassDate);
        const _altClassParts: number[] | null = parseNumberYearMonthDate(selectedClass?.date);

        if (_mainClassParts && _altClassParts) {
          const dateChangeCompare: number = compareYearMonthStr(selectedClass.date, selectedClass.mainDayClassDate);
          if (dateChangeCompare === 1) {
            fetchData(_mainClassParts[0], _mainClassParts[1], _altClassParts[0], _altClassParts[1]);
          } else if (dateChangeCompare === -1) {
            fetchData(_altClassParts[0], _altClassParts[1], _mainClassParts[0], _mainClassParts[1]);
          } else if (viewDate) {
            fetchData(viewDate[0].getFullYear(), viewDate[0].getMonth() + 1, viewDate[1].getFullYear(), viewDate[1].getMonth() + 1);
          }
        } else if (viewDate) {
          fetchData(viewDate[0].getFullYear(), viewDate[0].getMonth() + 1, viewDate[1].getFullYear(), viewDate[1].getMonth() + 1);
        }
      })
      .catch(error => {
        message.error(error.message);
      })
      .finally(async () => {
        setPendingAlt(undefined);
        setSelectedClass(undefined);
        setIsEventEditVisible(false);
        setLoading(false);
      });
    }
  }

  const handleDragClass = (dropLocation: any, draggedClass: any) => {
    return draggedClass.extendedProps.active;
  }

  const _renderClassStatus = (classContentEvent: EventApi): JSX.Element | undefined => {
    const _hasMainClassDate: boolean = classContentEvent.extendedProps.mainDayClassDate;
    
    if (_hasMainClassDate) {
      if (!classContentEvent.extendedProps.active) {
        return (
          <div>CANCELED</div>
        );
      }
      return (
        <div>ALT</div>
      );
    }
    return undefined;
  }

  const _renderClasses = (classContent: EventContentArg) => {
    if (!classContent.event.extendedProps.active) {
      classContent.isDragging = false;
    }

    return (
      <>
        {_renderClassStatus(classContent.event)}
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
          initialDate={currenDate}
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
          slotMaxTime='23:00:00'

          eventContent={_renderClasses}
          events={classes}
          eventClick={handleEventClick}
          eventChange={handleClassInfoChange}
          datesSet={handleDateChange}
          eventAllow={handleDragClass}
        />
      )}
      <Modal 
        visible={isEventEditVisible}
        width='50%'
        confirmLoading={loading}
        okText={pendingAlt ? 'Confirm': (selectedClass?.active ? 'Cancel' : 'Undo Cancel')}
        onOk={pendingAlt ? handleAltSubmit : handleToggleCancelSubmit}
        cancelText='Exit'
        onCancel={() => {
          setIsEventEditVisible(false); 
          setPendingAlt(undefined);
          setClasses([...classes]);
        }}
      >
        {pendingAlt ? _renderEditInput() : undefined}
      </Modal>
    </>
  );
}