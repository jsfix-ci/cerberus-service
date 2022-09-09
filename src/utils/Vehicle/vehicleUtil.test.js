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
    expect(VehicleUtil.colour(vehicle)).toEqual(mockTaskData.movement.vehicle.colour);
  });

  it.each([
    ...INVALID_VALUES,
  ])(`should return ${STRINGS.UNKNOWN_TEXT} when vehicle colour is invalid`, (colour) => {
    MOCK_TARGET_TASK.movement.vehicle.colour = colour;
    const vehicle = VehicleUtil.get(MOCK_TARGET_TASK);
    expect(VehicleUtil.colour(vehicle)).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should extract the vehicle make if present', () => {
    const vehicle = VehicleUtil.get(MOCK_TARGET_TASK);
    expect(VehicleUtil.make(vehicle)).toEqual(mockTaskData.movement.vehicle.make);
  });

  it.each([
    ...INVALID_VALUES,
  ])(`should return ${STRINGS.UNKNOWN_TEXT} when vehicle make is invalid`, (make) => {
    MOCK_TARGET_TASK.movement.vehicle.make = make;
    const vehicle = VehicleUtil.get(MOCK_TARGET_TASK);
    expect(VehicleUtil.make(vehicle)).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should extract the vehicle model if present', () => {
    const vehicle = VehicleUtil.get(MOCK_TARGET_TASK);
    expect(VehicleUtil.model(vehicle)).toEqual(mockTaskData.movement.vehicle.model);
  });

  it.each([
    ...INVALID_VALUES,
  ])(`should return ${STRINGS.UNKNOWN_TEXT} when vehicle model is invalid`, (model) => {
    MOCK_TARGET_TASK.movement.vehicle.model = model;
    const vehicle = VehicleUtil.get(MOCK_TARGET_TASK);
    expect(VehicleUtil.model(vehicle)).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should extract the vehicle registration if present', () => {
    const vehicle = VehicleUtil.get(MOCK_TARGET_TASK);
    expect(VehicleUtil.registration(vehicle)).toEqual(mockTaskData.movement.vehicle.registration);
  });

  it.each([
    ...INVALID_VALUES,
  ])(`should return ${STRINGS.UNKNOWN_TEXT} when vehicle registration is invalid`, (registration) => {
    MOCK_TARGET_TASK.movement.vehicle.registration = registration;
    const vehicle = VehicleUtil.get(MOCK_TARGET_TASK);
    expect(VehicleUtil.registration(vehicle)).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should extract the vehicle country of registration if present', () => {
    const vehicle = VehicleUtil.get(MOCK_TARGET_TASK);
    expect(VehicleUtil.nationality(vehicle)).toEqual(mockTaskData.movement.vehicle.nationality);
  });

  it.each([
    ...INVALID_VALUES,
  ])('should return unknown when vehicle country of registration is not present', (nationality) => {
    MOCK_TARGET_TASK.movement.vehicle.nationality = nationality;
    const vehicle = VehicleUtil.get(MOCK_TARGET_TASK);
    expect(VehicleUtil.nationality(vehicle)).toEqual(STRINGS.UNKNOWN_TEXT);
  });

  it('should extract the vehicle type if present', () => {
    const vehicle = VehicleUtil.get(MOCK_TARGET_TASK);
    expect(VehicleUtil.type(vehicle)).toEqual(mockTaskData.movement.vehicle.type);
  });

  it.each([
    ...INVALID_VALUES,
  ])('should return unknown when vehicle type is not present', (type) => {
    MOCK_TARGET_TASK.movement.vehicle.type = type;
    const vehicle = VehicleUtil.get(MOCK_TARGET_TASK);
    expect(VehicleUtil.type(vehicle)).toEqual(STRINGS.UNKNOWN_TEXT);
  });
});
