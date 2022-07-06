import { replaceInvalidValues } from '../../../utils/stringConversion';
import BaggageUtil from './baggageUtil';
import DateTimeUtil from './datetimeUtil';
import MovementUtil from './movementUtil';
import PersonUtil from './personUtil';
import RisksUtil from './risksUtil';

const toWarningsNode = (informationSheet) => {
  const risks = RisksUtil.getRisks(informationSheet);
  if (risks?.selector) {
    const warning = risks?.selector?.warning;
    if (warning) {
      return {
        warnings: {
          identified: replaceInvalidValues(warning?.status?.toLowerCase()),
          type: warning?.types,
          details: replaceInvalidValues(warning?.detail),
        },
      };
    }
  }
};

const toCategoryNode = (informationSheet) => {
  const risks = RisksUtil.getRisks(informationSheet);
  if (risks?.selector) {
    const category = risks?.selector?.category;
    if (category) {
      return {
        category: {
          id: `target_${category}`,
          name: category,
          value: `target_${category}`,
          label: category,
        },
      };
    }
  }
};

const toTargetingIndicatorsNode = (informationSheet) => {
  const risks = RisksUtil.getRisks(informationSheet);
  const targetingIndicators = RisksUtil.getIndicators(risks);
  if (targetingIndicators?.length) {
    return {
      targetingIndicators,
    };
  }
};

const toOperationNode = (informationSheet) => {
  if (informationSheet?.operation) {
    return {
      operation: replaceInvalidValues(informationSheet.operation),
    };
  }
};

const toPersonNode = (informationSheet) => {
  const person = PersonUtil.get(informationSheet);
  const flight = MovementUtil.movementFlight(informationSheet);
  const baggage = BaggageUtil.get(informationSheet);
  if (person) {
    return {
      person: {
        name: { ...person?.name },
        dateOfBirth: replaceInvalidValues(DateTimeUtil.format(person?.dateOfBirth, 'DD-MM-YYYY')),
        seatNumber: replaceInvalidValues(flight?.seatNumber),
        baggage: {
          bagCount: replaceInvalidValues(baggage?.numberOfCheckedBags),
          weight: replaceInvalidValues(baggage?.weight),
          tags: replaceInvalidValues(baggage?.tags),
        },
        nationality: {
          ...person?.nationality,
          value: replaceInvalidValues(person?.nationality?.id),
          label: replaceInvalidValues(person?.nationality?.nationality),
        },
        sex: {
          ...person?.gender,
          value: replaceInvalidValues(person?.gender?.id),
          label: replaceInvalidValues(person?.gender?.name),
        },
        document: {
          type: {
            ...person?.document?.type,
          },
          documentNumber: replaceInvalidValues(person?.document?.number),
          documentExpiry: replaceInvalidValues(DateTimeUtil.format(person?.document?.expiry, 'DD-MM-YYYY')),
        },
      },
    };
  }
};

const toMovementNode = (informationSheet) => {
  const flight = MovementUtil.movementFlight(informationSheet);
  const journey = MovementUtil.movementJourney(informationSheet);
  return {
    movement: {
      flightNumber: replaceInvalidValues(MovementUtil.flightNumber(flight))
      || replaceInvalidValues(informationSheet?.movement?.journey?.id),
      routeToUK: replaceInvalidValues(MovementUtil.movementRoute(journey)),
      arrival: {
        date: replaceInvalidValues(DateTimeUtil.format(MovementUtil.arrivalTime(journey), 'DD-MM-YYYY')),
        time: replaceInvalidValues(DateTimeUtil.format(MovementUtil.arrivalTime(journey), 'HH:mm')),
      },
    },
  };
};

const toPortNode = (informationSheet) => {
  if (informationSheet?.eventPort) {
    return {
      eventPort: informationSheet.eventPort,
    };
  }
};

const toIdNode = (informationSheet) => {
  if (informationSheet?.id) {
    return { businessKey: informationSheet.id };
  }
};

const toTisPrefillData = (informationSheet) => {
  let tisPrefillData = {};
  if (informationSheet) {
    tisPrefillData = {
      ...tisPrefillData,
      ...toIdNode(informationSheet),
      ...toPortNode(informationSheet),
      ...toMovementNode(informationSheet),
      ...toPersonNode(informationSheet),
      ...toOperationNode(informationSheet),
      ...toTargetingIndicatorsNode(informationSheet),
      ...toCategoryNode(informationSheet),
      ...toWarningsNode(informationSheet),
    };
  }
  return tisPrefillData;
};

const toTisSubmissionPayload = (formData) => {

};

const TargetInformationUtil = {
  toPrefill: toTisPrefillData,
  toSubmission: toTisSubmissionPayload,
};

export default TargetInformationUtil;

export { toTisPrefillData, toTisSubmissionPayload };
