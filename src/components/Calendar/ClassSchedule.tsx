import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Calendar, Modal, Button, Col, Form, Input, message, Descriptions } from 'antd';
// import type { Moment } from 'moment';
// import moment from 'moment';
// import ComponentLoading from '../common/ComponentLoading';

import FullCalendar, { EventApi, DateSelectArg, EventClickArg, EventContentArg, formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import moment from 'moment';

// import { IMainDay } from './core/types';
// import * as service from './core/service';
// import { numberPadLeft, omitTimeSeconds } from '../../utils/StringUtils';
// import { getWeekDayName } from '../../utils/DateTimeUtils';

export default function ClassSchedule() {
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

  const  handleDateSelect = (selectInfo: DateSelectArg) => {
    console.log(selectInfo);
  }

  const  handleEventClick = (clickInfo: EventClickArg) => {
    console.log(clickInfo);
  }

  return (
    <>
    <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: undefined,
          center: undefined,
          right: undefined
        }}
        initialView='timeGridWeek'
        editable
        selectable
        selectMirror
        dayMaxEvents
        weekends
        firstDay={1}
        // initialEvents={} // alternatively, use the `events` setting to fetch from a feed
        select={handleDateSelect}
        // eventContent={renderEventContent} // custom render function
        eventClick={handleEventClick}
        // eventsSet={handleEvents} // called after events are initialized/added/changed/removed
        /* you can update a remote database when these fire:
        eventAdd={function(){}}
        eventChange={function(){}}
        eventRemove={function(){}}
        */
       allDaySlot={false}
       dayHeaderContent={(args) => {
        return moment(args.date).format('ddd')
        }}
        slotDuration='00:15:00'
        slotLabelFormat={{hour: '2-digit', minute: '2-digit', hour12: false}}
        slotMinTime='06:00:00'
        slotMaxTime='22:00:00'
      />
    </>
  );
}