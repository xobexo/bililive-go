import React, { Suspense, lazy } from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import RootLayout from './component/layout/index';

const LiveList = lazy(() => import('./component/live-list/index'));
const LiveInfo = lazy(() => import('./component/live-info/index'));
const ConfigInfo = lazy(() => import('./component/config-info/index'));
const FileList = lazy(() => import('./component/file-list/index'));

const App: React.FC = () => {
  return (
    <RootLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path="/fileList/:path(.*)?" component={FileList}></Route>
          <Route path="/configInfo" component={ConfigInfo}></Route>
          <Route path="/liveInfo" component={LiveInfo}></Route>
          <Route path="/" component={LiveList}></Route>
        </Switch>
      </Suspense>
    </RootLayout>
  );
}

export default App;
