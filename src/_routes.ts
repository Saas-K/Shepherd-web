import ClassCalendar from './components/Calendar/ClassCalendar';
import ClassSchedule from './components/Calendar/ClassSchedule';
import CourseList from './components/Course/CourseList';
import CourseViewEdit from './components/Course/CourseViewEdit';
import EnrollmentList from './components/Enrollment/EnrollmentList';
import EnrollmentViewEdit from './components/Enrollment/EnrollmentViewEdit';
import StudentList from './components/Student/StudentList';
import StudentViewEdit from './components/Student/StudentViewEdit';
import PaymentList from './components/Payment/PaymentList';
import PaymentViewEdit from './components/Payment/PaymentViewEdit';

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
  // enrollment
  {
    path: '/enrollment',
    name: 'Enrollments',
    component: EnrollmentList
  },
  {
    path: '/enrollment/new',
    name: 'Enrollments',
    component: EnrollmentViewEdit
  },
  {
    path: '/enrollment/:id',
    name: 'Enrollments',
    component: EnrollmentViewEdit
  },
  {
    path: '/enrollment/:id/update',
    name: 'Enrollments',
    component: EnrollmentViewEdit
  },
  // payment
  {
    path: '/payment',
    name: 'Payments',
    component: PaymentList
  },
  {
    path: '/payment/new',
    name: 'Payments',
    component: PaymentViewEdit
  },
  {
    path: '/payment/:id',
    name: 'Payments',
    component: PaymentViewEdit
  },
  {
    path: '/payment/:id/update',
    name: 'Payments',
    component: PaymentViewEdit
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