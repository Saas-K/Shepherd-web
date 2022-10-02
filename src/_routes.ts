import ClassCalendar from './components/Calendar/ClassCalendar';
import ClassSchedule from './components/Calendar/ClassSchedule';
import CourseList from './components/Course/CourseList';
import CourseViewEdit from './components/Course/CourseViewEdit';


const routes: Array<{
  path: string;
  name: string;
  component: () => JSX.Element;
}> = [
  // course
  {
    path: '/course',
    name: 'Courses',
    component: CourseList
  },
  {
    path: '/course/new',
    name: 'Courses',
    component: CourseViewEdit
  },
  {
    path: '/course/:id',
    name: 'Courses',
    component: CourseViewEdit
  },
  {
    path: '/course/:id/update',
    name: 'Courses',
    component: CourseViewEdit
  },
  // time
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