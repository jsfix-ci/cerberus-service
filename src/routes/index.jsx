import React from 'react';
import { BrowserRouter, Link, Redirect, Route } from 'react-router-dom';
import { initAll } from 'govuk-frontend';

import { useKeycloak } from '../context/Keycloak';
import Layout from '../components/Layout/Layout';
import PnrAccessRequest from '../access/PnrAccessRequest';

import AirPaxTaskListPage from './TaskList/TaskListPage';
import AirPaxTaskDetailsPage from './TaskDetails/TaskDetailsPage';

import RoRoTaskListPage from './TaskList/TaskListPage';
import RoRoTaskDetailsPage from './TaskDetails/TaskDetailsPage';

// TODO: TO be decommissioned at a later point
import RoRoTaskListPageV1 from './roro/TaskLists/TaskListPage';
import RoRoTaskDetailsPageV1 from './roro/TaskDetails/TaskDetailsPage';
import RoRoIssueTargetPageV1 from './roro/IssueTargetPage';

// Hooks
import { useGetAirpaxRefDataMode, useGetRefDataAirlineCodes } from '../utils/Hooks/hooks';
import { TASK_LIST_PATHS } from '../utils/constants';

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
        <Route path="/" exact><Redirect to={TASK_LIST_PATHS.RORO} /></Route>
        <Route path={TASK_LIST_PATHS.RORO} exact><Layout><RoRoTaskListPageV1 /></Layout></Route>
        <Route path={`${TASK_LIST_PATHS.RORO}/:businessKey`} exact>
          <Layout beforeMain={<Link className="govuk-back-link" to={TASK_LIST_PATHS.RORO}>Back to task list</Link>}>
            <RoRoTaskDetailsPageV1 />
          </Layout>
        </Route>
        <Route path={TASK_LIST_PATHS.ISSUE_TARGET} exact><Layout><RoRoIssueTargetPageV1 /></Layout></Route>

        <Route path={TASK_LIST_PATHS.AIRPAX} exact><Layout><AirPaxTaskListPage /></Layout></Route>
        <Route path={`${TASK_LIST_PATHS.AIRPAX}/:businessKey`} exact>
          <Layout beforeMain={<Link className="govuk-back-link" to={TASK_LIST_PATHS.AIRPAX}>Back to task list</Link>}>
            <AirPaxTaskDetailsPage />
          </Layout>
        </Route>

        <Route path={TASK_LIST_PATHS.RORO_V2} exact><Layout><RoRoTaskListPage /></Layout></Route>
        <Route path={`${TASK_LIST_PATHS.RORO_V2}/:businessKey`} exact>
          <Layout beforeMain={<Link className="govuk-back-link" to={TASK_LIST_PATHS.RORO_V2}>Back to task list</Link>}>
            <RoRoTaskDetailsPage />
          </Layout>
        </Route>
      </PnrAccessRequest>
    </BrowserRouter>
  );
};

export default AppRouter;
