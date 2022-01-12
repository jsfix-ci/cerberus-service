import generateTotalPassengers from '../passengersGenerator';

import { roroDataDriver1Pax, roroDataDriver2Pax, roroDataBlankDriver2Pax, roroDataDriverNoPax } from '../__fixtures__/roroDataDriverPassengers.fixture';

describe('Passengers Generator', () => {
  it('should generate a new list of 2 passengers from given', () => {
    const totalPassengers = generateTotalPassengers(roroDataDriver1Pax.driver, roroDataDriver1Pax.passengers);
    expect(totalPassengers.length).toEqual(2);
  });

  it('should generate a new list of 3 passengers from given', () => {
    const totalPassengers = generateTotalPassengers(roroDataDriver2Pax.driver, roroDataDriver2Pax.passengers);
    expect(totalPassengers.length).toEqual(3);
  });

  it('should generate a new list of 2 passengers when driver name is blank', () => {
    const totalPassengers = generateTotalPassengers(roroDataBlankDriver2Pax.driver, roroDataBlankDriver2Pax.passengers);
    expect(totalPassengers.length).toEqual(2);
  });

  it('should generate a new list of a single passenger when passengers array is empty', () => {
    const totalPassengers = generateTotalPassengers(roroDataDriverNoPax.driver, roroDataDriverNoPax.passengers);
    expect(totalPassengers.length).toEqual(1);
  });
});
