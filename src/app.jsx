/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}


// export default function App() {
//   useScrollToTop();

//   const renderChildren = () => {
//     const childrenArray = Router.Children.toArray(Router().props.children);

//     return childrenArray.map((child, index) => (
//       <ThemeProvider key={index}>
//         {Router.cloneElement(child, { key: index })}
//       </ThemeProvider>
//     ));
//   };

//   return <>{renderChildren()}</>;
// }