import Page from "./components/Comp1/Page";

const routes: Array<{
  path: string;
  name: string;
  component: () => JSX.Element;
}> = [
  {
    path: '/images',
    name: 'images',
    component: Page
  }
];

export default routes;