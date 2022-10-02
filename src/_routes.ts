import ClassCalendar from './components/Calendar/ClassCalendar';
import ClassSchedule from './components/Calendar/ClassSchedule';
import CourseList from './components/Course/CourseList';
import CourseViewEdit from './components/Course/CourseViewEdit';
import StudentList from './components/Student/StudentList';
import StudentViewEdit from './components/Student/StudentViewEdit';

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
  // student
  {
    path: '/student',
    name: 'Students',
    component: StudentList
  },
  {
    path: '/student/new',
    name: 'Students',
    component: StudentViewEdit
  },
  {
    path: '/student/:id',
    name: 'Students',
    component: StudentViewEdit
  },
  {
    path: '/student/:id/update',
    name: 'Students',
    component: StudentViewEdit
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