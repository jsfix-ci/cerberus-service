import setupFilterCounts from './setupCounts';
import filter from '../../../forms/filters';
import { MODE, MOVEMENT_MODES, TASK_STATUS } from '../../../utils/constants';

describe('SetupFilterCounts', () => {
  it('should set up selectors counts for an airpax filter', () => {
    const filtersAndSelectorCounts = [
      {
        filterParams: {
          movementModes: [],
          selectors: 'ANY',
        },
        statusCounts: {
          inProgress: 0,
          issued: 0,
          complete: 0,
          new: 5,
        },
      },
      {
        filterParams: {
          movementModes: [],
          selectors: 'PRESENT',
        },
        statusCounts: {
          inProgress: 0,
          issued: 0,
          complete: 0,
          new: 2,
        },
      },
      {
        filterParams: {
          movementModes: [],
          selectors: 'NOT_PRESENT',
        },
        statusCounts: {
          inProgress: 0,
          issued: 0,
          complete: 0,
          new: 8,
        },
      },
      {
        filterParams: {
          movementModes: [],
          selectors: 'ANY',
        },
        statusCounts: {
          inProgress: 0,
          issued: 0,
          complete: 0,
          new: 2,
        },
      },
    ];

    const modeCounts = filtersAndSelectorCounts?.slice(0, 1);
    const selectorCounts = filtersAndSelectorCounts?.slice(1);

    const filterJson = setupFilterCounts(
      filter('test', false, MODE.AIRPAX), TASK_STATUS.NEW, modeCounts, selectorCounts,
    );
    const selectorOptions = filterJson.pages[0].components.find((component) => component.id === 'selectors').data.options;
    expect(selectorOptions[0].label).toEqual('Has no selector (8)');
    expect(selectorOptions[1].label).toEqual('Has selector (2)');
    expect(selectorOptions[2].label).toEqual('Both (2)');
  });

  it('should set up mode counts for a roro filter', () => {
    const filtersAndSelectorCounts = [
      {
        filterParams: {
          movementModes: [MOVEMENT_MODES.ACCOMPANIED_FREIGHT],
          selectors: 'ANY',
        },
        statusCounts: {
          inProgress: 0,
          issued: 0,
          complete: 0,
          new: 5,
        },
      },
      {
        filterParams: {
          movementModes: [MOVEMENT_MODES.UNACCOMPANIED_FREIGHT],
          selectors: 'PRESENT',
        },
        statusCounts: {
          inProgress: 0,
          issued: 0,
          complete: 0,
          new: 2,
        },
      },
      {
        filterParams: {
          movementModes: [MOVEMENT_MODES.TOURIST],
          selectors: 'NOT_PRESENT',
        },
        statusCounts: {
          inProgress: 0,
          issued: 0,
          complete: 0,
          new: 8,
        },
      },
      {
        filterParams: {
          movementModes: [],
          selectors: 'ANY',
        },
        statusCounts: {
          inProgress: 0,
          issued: 0,
          complete: 0,
          new: 2,
        },
      },
      {
        filterParams: {
          movementModes: [],
          selectors: 'NOT_PRESENT',
        },
        statusCounts: {
          inProgress: 0,
          issued: 0,
          complete: 0,
          new: 8,
        },
      },
      {
        filterParams: {
          movementModes: [],
          selectors: 'ANY',
        },
        statusCounts: {
          inProgress: 0,
          issued: 0,
          complete: 0,
          new: 2,
        },
      },
    ];

    const modeCounts = filtersAndSelectorCounts?.slice(0, 3);
    const selectorCounts = filtersAndSelectorCounts?.slice(3);

    const filterJson = setupFilterCounts(
      filter('test', false, MODE.RORO), TASK_STATUS.NEW, modeCounts, selectorCounts,
    );
    const modeOptions = filterJson.pages[0].components.find((component) => component.id === 'mode').data.options;
    expect(modeOptions[0].label).toEqual('RoRo unaccompanied freight (2)');
    expect(modeOptions[1].label).toEqual('RoRo accompanied freight (5)');
    expect(modeOptions[2].label).toEqual('RoRo Tourist (8)');
  });
});
