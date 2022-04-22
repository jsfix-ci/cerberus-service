import React, { useEffect, useState } from 'react';
import { TARGETER_GROUP,
  TASK_STATUS_COMPLETED,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_NEW,
  TASK_STATUS_TARGET_ISSUED } from '../../../constants';
import { useKeycloak } from '../../../utils/keycloak';
import Tabs from '../../../components/Tabs';

const TasksTab = ({ taskStatus }) => {
  return (
    <p>There are no {taskStatus} tasks</p>
  );
};

const TaskListPage = () => {
  const keycloak = useKeycloak();
  const [authorisedGroup, setAuthorisedGroup] = useState();

  useEffect(() => {
    const isTargeter = keycloak.tokenParsed.groups.indexOf(TARGETER_GROUP) > -1;
    if (!isTargeter) {
      setAuthorisedGroup(false);
    }
    if (isTargeter) {
      setAuthorisedGroup(true);
    }
  }, []);
  return (
    <>
      <h1 className="govuk-heading-xl">Task management</h1>
      {!authorisedGroup && <p>You are not authorised to view these tasks.</p>}

      {authorisedGroup && (
        <div className="govuk-grid-row">
          <section className="govuk-grid-column-one-quarter">
            <div className="cop-filters-container">
              <div className="cop-filters-header">
                <h2 className="govuk-heading-s">Filters</h2>
              </div>
            </div>
          </section>

          <section className="govuk-grid-column-three-quarters">
            <Tabs
              title="Title"
              id="tasks"
              items={[
                {
                  id: TASK_STATUS_NEW,
                  label: 'New',
                  panel: (
                    <>
                      <h2 className="govuk-heading-l">New tasks</h2>
                      <TasksTab
                        taskStatus={TASK_STATUS_NEW}
                      />
                    </>
                  ),
                },
                {
                  id: TASK_STATUS_IN_PROGRESS,
                  label: 'In progress',
                  panel: (
                    <>
                      <h2 className="govuk-heading-l">In progress tasks</h2>
                      <TasksTab
                        taskStatus={TASK_STATUS_IN_PROGRESS}
                      />
                    </>
                  ),
                },
                {
                  id: TASK_STATUS_TARGET_ISSUED,
                  label: 'Issued',
                  panel: (
                    <>
                      <h2 className="govuk-heading-l">Target issued tasks</h2>
                      <TasksTab
                        taskStatus={TASK_STATUS_TARGET_ISSUED}
                      />
                    </>
                  ),
                },
                {
                  id: TASK_STATUS_COMPLETED,
                  label: 'Complete',
                  panel: (
                    <>
                      <h2 className="govuk-heading-l">Completed tasks</h2>
                      <TasksTab
                        taskStatus={TASK_STATUS_COMPLETED}
                      />
                    </>
                  ),
                },
              ]}
            />
          </section>
        </div>
      )}
    </>
  );
};

export default TaskListPage;
