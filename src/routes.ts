import ClassCalendar from './components/Calendar/ClassCalendar';
import ClassSchedule from './components/Calendar/ClassSchedule';


const routes: Array<{
  path: string;
  name: string;
  component: () => JSX.Element;
}> = [
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