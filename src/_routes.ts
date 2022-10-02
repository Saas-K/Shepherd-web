import ClassCalendar from './components/Calendar/ClassCalendar';
import ClassSchedule from './components/Calendar/ClassSchedule';
import CourseList from './components/Course/CourseList';


const routes: Array<{
  path: string;
  name: string;
  component: () => JSX.Element;
}> = [
  {
    path: '/course',
    name: 'Courses',
    component: CourseList
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: ClassCalendar
  },
  {
    path: '/schedule',
    name: 'schedule',
    component: ClassSchedule
  }
];

export default routes;