import React from 'react';
import { BrowserRouter, Link, Redirect, Route } from 'react-router-dom';
import { initAll } from 'govuk-frontend';

import { useKeycloak } from '../context/Keycloak';
import Layout from '../components/Layout/Layout';
import PnrAccessRequest from '../access/PnrAccessRequest';

import AirPaxTaskListPage from './TaskList/TaskListPage'; // TODO: Remove

// import AirPaxTaskListPage from './airpax/TaskList/TaskListPage';
import AirPaxTaskDetailsPage from './airpax/TaskDetails/TaskDetailsPage';

import RoRoTaskListPageV1 from './roro/TaskLists/TaskListPage';
import RoRoTaskDetailsPageV1 from './roro/TaskDetails/TaskDetailsPage';
import RoRoIssueTargetPageV1 from './roro/IssueTargetPage';

import RoRoTaskListPageV2 from './TaskList/TaskListPage'; // TODO: Remove

// Hooks
import { useGetAirpaxRefDataMode, useGetRefDataAirlineCodes } from '../utils/Hooks/hooks';

const AppRouter = () => {
  const keycloak = useKeycloak();

  initAll();
  useGetAirpaxRefDataMode();
  useGetRefDataAirlineCodes();

  if (!keycloak) {
    return null;
  }

  document.body.className = document.body.className ? `${document.body.className} js-enabled` : 'js-enabled';

  /*
   * The default is currently to show the RoRo pages
   * RoRo does not require a user to sign in to view
   * PNR restricted data, whereas AirPax does
   * Therefore RoRo is the safe option for the non-specific
   * URLs
   *
   * We also cater to /roro/tasks incase a user decides
   * to type that, and also so in the future the default
   * can be changed
   *
   * Note, all tests, and some other pages currently reference
   * the default link (/tasks) rather than the
   * RoRo specific link (/roro/tasks)
   * as they have not yet been refactored
  */

  return (
    <BrowserRouter>
      <PnrAccessRequest>
        <Route path="/" exact><Redirect to="/tasks" /></Route>
        <Route path="/tasks" exact><Layout><RoRoTaskListPageV1 /></Layout></Route>
        <Route path="/tasks/:businessKey" exact>
          <Layout beforeMain={<Link className="govuk-back-link" to="/tasks">Back to task list</Link>}>
            <RoRoTaskDetailsPageV1 />
          </Layout>
        </Route>
        <Route path="/issue-target" exact><Layout><RoRoIssueTargetPageV1 /></Layout></Route>

        <Route path="/roro/v2/tasks" exact><Layout><RoRoTaskListPageV2 /></Layout></Route>
        <Route path="/airpax/tasks" exact><Layout><AirPaxTaskListPage /></Layout></Route>
        <Route path="/airpax/tasks/:businessKey" exact>
          <Layout beforeMain={<Link className="govuk-back-link" to="/airpax/tasks">Back to task list</Link>}>
            <AirPaxTaskDetailsPage />
          </Layout>
        </Route>
      </PnrAccessRequest>
    </BrowserRouter>
  );
};

export default AppRouter;
