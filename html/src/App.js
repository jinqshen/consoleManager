import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import routers from './components/router/routers';
import { useAuth } from './context';

function App() {

  const authElement = useRoutes(routers.auth);
  const unauthElement = useRoutes(routers.unauth);
  const { user } = useAuth();
  return (
    <Suspense fallback={<></>}>
      { user ? authElement : unauthElement }
    </Suspense>
  );
}

export default App;