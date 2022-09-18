import ClassesCalendar from './components/Calendar/ClassesCalendar';

const routes: Array<{
  path: string;
  name: string;
  component: () => JSX.Element;
}> = [
  {
    path: '/calendar',
    name: 'calendar',
    component: ClassesCalendar
  }
];

export default routes;