import _ from 'lodash';
import VehicleUtil from './vehicleUtil';

import mockTaskData from '../../__fixtures__/taskData_RoRo_Accompanied_AssigneeCurrentUser.fixture.json';

import { STRINGS } from '../constants';

describe('VehicleUtil', () => {
  let MOCK_TARGET_TASK = {};

  const INVALID_VALUES = [
    [undefined],
    [null],
    [''],
  ];

  beforeEach(() => {
    MOCK_TARGET_TASK = _.cloneDeep(mockTaskData);
  });

  it('should extract the vehicle node if present', () => {
    expect(VehicleUtil.get(MOCK_TARGET_TASK)).toMatchObject(mockTaskData.movement.vehicle);
  });

  it.each([
    [undefined],
    [null],
  ])('should return undefined when the vessel node is not present', (vehicle) => {
    MOCK_TARGET_TASK.movement.vehicle = vehicle;
    expect(VehicleUtil.get(MOCK_TARGET_TASK)).toBeUndefined();
  });

  it('should extract the vehicle colour if present', () => {
    const vehicle = VehicleUtil.get(MOCK_TARGET_TASK);
    expect(VehicleUtil.vehicleColour(vehicle)).toEqual(mockTaskData.movement.vehicle.colour);
  });

  it.each([
    ...INVALID_VALUES,
  ])(`should return ${STRINGS.UNKNOWN_TEXT} when vehicle colour is invalid`, (colour) => {
    MOCK_TARGET_TASK.movement.vehicle.colour = colour;
    const vehicle = VehicleUtil.get(MOCK_TARGET_TASK);
    expect(VehicleUtil.vehicleColour(vehicle)).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should extract the vehicle make if present', () => {
    const vehicle = VehicleUtil.get(MOCK_TARGET_TASK);
    expect(VehicleUtil.vehicleMake(vehicle)).toEqual(mockTaskData.movement.vehicle.make);
  });

  it.each([
    ...INVALID_VALUES,
  ])(`should return ${STRINGS.UNKNOWN_TEXT} when vehicle make is invalid`, (make) => {
    MOCK_TARGET_TASK.movement.vehicle.make = make;
    const vehicle = VehicleUtil.get(MOCK_TARGET_TASK);
    expect(VehicleUtil.vehicleMake(vehicle)).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should extract the vehicle model if present', () => {
    const vehicle = VehicleUtil.get(MOCK_TARGET_TASK);
    expect(VehicleUtil.vehicleModel(vehicle)).toEqual(mockTaskData.movement.vehicle.model);
  });

  it.each([
    ...INVALID_VALUES,
  ])(`should return ${STRINGS.UNKNOWN_TEXT} when vehicle model is invalid`, (model) => {
    MOCK_TARGET_TASK.movement.vehicle.model = model;
    const vehicle = VehicleUtil.get(MOCK_TARGET_TASK);
    expect(VehicleUtil.vehicleModel(vehicle)).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should extract the vehicle registration if present', () => {
    const vehicle = VehicleUtil.get(MOCK_TARGET_TASK);
    expect(VehicleUtil.vehicleReg(vehicle)).toEqual(mockTaskData.movement.vehicle.registration);
  });

  it.each([
    ...INVALID_VALUES,
  ])(`should return ${STRINGS.UNKNOWN_TEXT} when vehicle registration is invalid`, (registration) => {
    MOCK_TARGET_TASK.movement.vehicle.registration = registration;
    const vehicle = VehicleUtil.get(MOCK_TARGET_TASK);
    expect(VehicleUtil.vehicleReg(vehicle)).toEqual(STRINGS.UNKNOWN_TEXT);
  });
});
