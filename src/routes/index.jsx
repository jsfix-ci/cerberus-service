import React from 'react';
import { BrowserRouter, Link, Redirect, Route } from 'react-router-dom';
import { initAll } from 'govuk-frontend';

import { useKeycloak } from '../context/Keycloak';
import Layout from '../components/Layout/Layout';
import PnrAccessRequest from '../access/PnrAccessRequest';

import TaskListPage from './TaskList/TaskListPage';
import TaskDetailsPage from './TaskDetails/TaskDetailsPage';

// TODO: To be removed at a later point
import RoRoTaskListPageV1 from './roro/TaskLists/TaskListPage';
import RoRoTaskDetailsPageV1 from './roro/TaskDetails/TaskDetailsPage';
import RoRoIssueTargetPageV1 from './roro/IssueTargetPage';

// Hooks
import { useGetRefDataAirlineCodes } from '../utils/Hooks/hooks';
import { PATHS } from '../utils/constants';

const AppRouter = () => {
  const keycloak = useKeycloak();

  initAll();
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
        <Route path="/" exact><Redirect to={PATHS.RORO} /></Route>
        <Route path={PATHS.RORO} exact><Layout><RoRoTaskListPageV1 /></Layout></Route>
        <Route path={`${PATHS.RORO}/:businessKey`} exact>
          <Layout beforeMain={<Link className="govuk-back-link" to={PATHS.RORO}>Back to task list</Link>}>
            <RoRoTaskDetailsPageV1 />
          </Layout>
        </Route>
        <Route path={PATHS.ISSUE_TARGET} exact><Layout><RoRoIssueTargetPageV1 /></Layout></Route>

        <Route path={PATHS.AIRPAX} exact>
          <Layout>
            <TaskListPage />
          </Layout>
        </Route>
        <Route path={`${PATHS.AIRPAX}/:businessKey`} exact>
          <Layout beforeMain={<Link className="govuk-back-link" to={PATHS.AIRPAX}>Back to task list</Link>}>
            <TaskDetailsPage />
          </Layout>
        </Route>

        <Route path={PATHS.RORO_V2} exact>
          <Layout>
            <TaskListPage />
          </Layout>
        </Route>
        <Route path={`${PATHS.RORO_V2}/:businessKey`} exact>
          <Layout beforeMain={<Link className="govuk-back-link" to={PATHS.RORO_V2}>Back to task list</Link>}>
            <TaskDetailsPage />
          </Layout>
        </Route>
      </PnrAccessRequest>
    </BrowserRouter>
  );
};

export default AppRouter;
