import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// Config
import config from '../../../config';
// Utils
import useAxiosInstance from '../../../utils/axiosInstance';
import { useKeycloak } from '../../../utils/keycloak';
import findAndUpdateTaskVersionDifferencesV2 from '../../../utils/findAndUpdateTaskVersionDifferencesV2';

// Components/Pages
import ActivityLog from '../../../components/ActivityLog';
import LoadingSpinner from '../../../components/LoadingSpinner';
import TaskVersions from './TaskVersions';

const TaskDetailsPage = () => {
  const { businessKey } = useParams();
  const keycloak = useKeycloak();
  const apiClient = useAxiosInstance(keycloak, config.taskApiUrl);
  const currentUser = keycloak.tokenParsed.email;
  const [assignee, setAssignee] = useState();
  const [taskData, setTaskData] = useState();
  const [isLoading, setLoading] = useState(true);

  // TEMP VALUES FOR TESTING UNTIL API ACTIVE
  const tempData = {
    data: {
      // paste data from the relevant fixture here for testing this page
      id: 'DEV-20220419-001',
      status: 'NEW',
      assignee: 'test',
      relisted: false,
      latestVersionNumber: 1,
      notes: [
        {
          id: '123',
          content: 'task created',
          timestamp: '2022-04-19T10:01:48.460594Z',
          userId: 'rules-based-targeting',
        },
      ],
      movement: {
        id: 'AIRPAXTSV:CMID=9c19fe74233c057f25e5ad333672c3f9/2b4a6b5b08ea434880562d6836b1111',
        status: 'PRE_ARRIVAL',
        mode: 'AIR_PASSENGER',
        description: 'individual',
        booking: {
          reference: null,
          type: null,
          paymentMethod: null,
          bookedAt: null,
          checkInAt: null,
          ticket: {
            number: null,
            type: null,
            price: null,
          },
          country: null,
        },
        journey: {
          id: 'BA103',
          arrival: {
            country: null,
            location: 'LHR',
            time: null,
          },
          departure: {
            country: null,
            location: 'FRA',
            time: '2020-08-07T17:15:00Z',
          },
          route: [
            'FRA',
            'LHR',
          ],
          itinerary: [
            {
              id: 'BA103',
              arrival: {
                country: null,
                location: 'LHR',
                time: null,
              },
              departure: {
                country: null,
                location: 'FRA',
                time: '2020-08-07T17:15:00Z',
              },
            },
          ],
        },
        vessel: null,
        person: {
          entitySearchUrl: null,
          name: {
            first: 'Isaiah',
            last: 'Ford',
            full: 'Isaiah Ford',
          },
          role: 'PASSENGER',
          dateOfBirth: '1966-05-13T00:00:00Z',
          gender: 'M',
          nationality: 'GBR',
          document: null,
          movementStats: null,
          frequentFlyerNumber: null,
        },
        otherPersons: [],
        flight: {
          departureStatus: 'DC',
          number: 'BA103',
          operator: 'BA',
          seatNumber: null,
        },
        baggage: {
          numberOfCheckedBags: 1,
          weight: '1',
        },
        vehicle: null,
        trailer: null,
        goods: null,
        haulier: null,
        account: null,
        booker: null,
        occupants: null,
      },
      risks: {
        targetingIndicators: {
          indicators: [
            {
              id: 1,
              name: 'VEHICLE-FREIGHT-QUICK-TURNAROUND-0_24_HRS',
              description: 'Quick turnaround freight (under 24 hours)',
              score: 30,
            },
            {
              id: 2,
              name: 'VEHICLE-TOURIST-QUICK-TURNAROUND-0_24_HRS',
              description: 'Quick turnaround tourist (under 24 hours)',
              score: 30,
            },
          ],
          count: 2,
          score: 60,
        },
        matchedRules: [],
        matchedSelectorGroups: {
          groups: [],
          totalNumberOfSelectors: 0,
        },
        highestThreatLevel: null,
      },
      versions: [
        {
          number: 3,
          createdAt: '2022-04-20T12:17:45.259425Z',
          movement: {},
          risks: {
            targetingIndicators: {},
            matchedRules: [],
            matchedSelectorGroups: {},
            highestThreatLevel: {
              type: 'RULE',
              value: 'Tier 4',
            },
          },
        },
        {
          number: 2,
          createdAt: '2022-05-20T10:26:03.232421Z',
          movement: {},
          risks: {
            targetingIndicators: {},
            matchedRules: [],
            matchedSelectorGroups: {},
            highestThreatLevel: {
              type: 'SELECTOR',
              value: 'A',
            },
          },
        },
        {
          number: 1,
          createdAt: '2022-06-20T10:26:03.232421Z',
          movement: {},
          risks: {
            targetingIndicators: {},
            matchedRules: [],
            matchedSelectorGroups: {},
            highestThreatLevel: null,
          },
        },
      ],
    },
  };

  const getTaskData = async () => {
    let response;
    try {
      response = await apiClient.get(`/targeting-tasks/${businessKey}`);
      setTaskData(response.data);
    } catch {
      // until API is ready we set the temp data in the catch
      // this will be changed to the error handling
      response = tempData;

      // findAndUpdateTaskVersionDifferences is a mutable function
      const { differencesCounts } = findAndUpdateTaskVersionDifferencesV2(response.data.versions);
      setTaskData({
        ...response.data, taskVersionDifferencesCounts: differencesCounts,
      });
    }
  };

  useEffect(() => {
    if (taskData) {
      setAssignee(taskData.assignee);
      setLoading(false);
    }
  }, [taskData, setAssignee, setLoading]);

  useEffect(() => {
    getTaskData(businessKey);
  }, [businessKey]);

  // TEMP NOTES FORM FOR TESTING
  const AddANoteForm = () => {
    return (
      <div>
        Add a new note
      </div>
    );
  };

  if (isLoading) {
    return <LoadingSpinner><br /><br /><br /></LoadingSpinner>;
  }

  return (
    <>
      <div className="govuk-grid-row govuk-task-detail-header govuk-!-padding-bottom-9">
        <div className="govuk-grid-column-one-half">
          <span className="govuk-caption-xl">{businessKey}</span>
          <h3 className="govuk-heading-xl govuk-!-margin-bottom-0">Overview</h3>
        </div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <TaskVersions
            taskVersions={taskData?.versions}
            businessKey={businessKey}
            taskVersionDifferencesCounts={taskData?.taskVersionDifferencesCounts}
          />
        </div>
        <div className="govuk-grid-column-one-third">
          {currentUser === assignee && <AddANoteForm />}
          <ActivityLog
            activityLog={taskData?.notes}
          />
        </div>
      </div>

    </>
  );
};

export default TaskDetailsPage;
