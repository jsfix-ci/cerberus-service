import { RORO_ACCOMPANIED_ICON, RORO_NO_ICON, RORO_TOURIST_CAR_ICON, RORO_TOURIST_GROUP_ICON, RORO_TOURIST_INDIVIDUAL_ICON,
  RORO_UNACCOMPANIED_ICON, RORO_VAN_ICON } from '../../constants';
import getMovementModeIcon from '../getVehicleModeIcon';
import { roroTouristNoVehicleHasPax, roroTouristVehicleHasPax, roroTouristNoVehicleOnePax, roroAccompVehicleNoTrailerHasPax,
  roroAccompVehicleWithTrailerHasPax, roroUnaccompNoVehicleHasTrailer, roroUnaccompNoVehicleNoTrailer, roroAccompNoVehicleNoTrailer,
  roroUnaccompVehicleNoTrailer } from '../__fixtures__/vehicleModeIcon.fixture';

describe('vehicleModeIcon', () => {
  it('should return RoRo group passengers icon for a group of foot pasenegrs without a vehicle', () => {
    const resultIcon = getMovementModeIcon(roroTouristNoVehicleHasPax.movementMode, roroTouristNoVehicleHasPax.vehicle, roroTouristNoVehicleHasPax.passengers);
    expect(resultIcon).toEqual(RORO_TOURIST_GROUP_ICON);
  });

  it('should return RoRo car icon for a tourist with vehicle', () => {
    const resultIcon = getMovementModeIcon(roroTouristVehicleHasPax.movementMode, roroTouristVehicleHasPax.vehicle, roroTouristVehicleHasPax.passengers);
    expect(resultIcon).toEqual(RORO_TOURIST_CAR_ICON);
  });

  it('should return RoRo person icon for a single foot passenger without a car', () => {
    const resultIcon = getMovementModeIcon(roroTouristNoVehicleOnePax.movementMode, roroTouristNoVehicleOnePax.vehicle, roroTouristNoVehicleOnePax.passengers);
    expect(resultIcon).toEqual(RORO_TOURIST_INDIVIDUAL_ICON);
  });

  it('should return a van icon for RoRo Accompanied freight with vehicle and no trailer', () => {
    const resultIcon = getMovementModeIcon(roroAccompVehicleNoTrailerHasPax.movementMode, roroAccompVehicleNoTrailerHasPax.vehicle,
      roroAccompVehicleNoTrailerHasPax.passengers);
    expect(resultIcon).toEqual(RORO_VAN_ICON);
  });

  it('should not return any icon for RoRo Accompanied freight with no vehicle, no trailer', () => {
    const resultIcon = getMovementModeIcon(roroAccompNoVehicleNoTrailer.movementMode, roroAccompNoVehicleNoTrailer.vehicle,
      roroAccompNoVehicleNoTrailer.passengers);
    expect(resultIcon).toEqual(RORO_NO_ICON);
  });

  it('should return a hgv icon for RoRo Accompanied freight with vehicle and a trailer', () => {
    const resultIcon = getMovementModeIcon(roroAccompVehicleWithTrailerHasPax.movementMode, roroAccompVehicleWithTrailerHasPax.vehicle,
      roroAccompVehicleWithTrailerHasPax.passengers);
    expect(resultIcon).toEqual(RORO_ACCOMPANIED_ICON);
  });

  it('should return a trailer icon for RoRo Unaccompanied freight with no vehicle and trailer', () => {
    const resultIcon = getMovementModeIcon(roroUnaccompNoVehicleHasTrailer.movementMode, roroUnaccompNoVehicleHasTrailer.vehicle,
      roroUnaccompNoVehicleHasTrailer.passengers);
    expect(resultIcon).toEqual(RORO_UNACCOMPANIED_ICON);
  });

  it('should not return any icon for RoRo Unaccompanied freight with no vehicle, no trailer', () => {
    const resultIcon = getMovementModeIcon(roroUnaccompNoVehicleNoTrailer.movementMode, roroUnaccompNoVehicleNoTrailer.vehicle,
      roroUnaccompNoVehicleNoTrailer.passengers);
    expect(resultIcon).toEqual(RORO_NO_ICON);
  });

  it('should return a car icon for RoRo Unaccompanied freight with vehicle, no trailer', () => {
    const resultIcon = getMovementModeIcon(roroUnaccompVehicleNoTrailer.movementMode, roroUnaccompVehicleNoTrailer.vehicle,
      roroUnaccompVehicleNoTrailer.passengers);
    expect(resultIcon).toEqual(RORO_VAN_ICON);
  });
});
