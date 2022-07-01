import { replaceInvalidValues } from '../../../utils/stringConversion';
import BaggageUtil from './baggageUtil';
import DateTimeUtil from './datetimeUtil';
import MovementUtil from './movementUtil';
import PersonUtil from './personUtil';
import RisksUtil from './risksUtil';

const toWarningsNode = (data) => {
  const risks = RisksUtil.getRisks(data);
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

const toCategoryNode = (data) => {
  const risks = RisksUtil.getRisks(data);
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

const toTargetingIndicatorsNode = (data) => {
  const risks = RisksUtil.getRisks(data);
  const targetingIndicators = RisksUtil.getIndicators(risks);
  if (targetingIndicators?.length) {
    return {
      targetingIndicators,
    };
  }
};

const toOperationNode = (data) => {
  if (data?.operation) {
    return {
      operation: replaceInvalidValues(data.operation),
    };
  }
};

const toPersonNode = (data) => {
  const person = PersonUtil.get(data);
  const flight = MovementUtil.movementFlight(data);
  const baggage = BaggageUtil.get(data);
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

const toMovementNode = (data) => {
  const flight = MovementUtil.movementFlight(data);
  const journey = MovementUtil.movementJourney(data);
  return {
    movement: {
      flightNumber: replaceInvalidValues(MovementUtil.flightNumber(flight))
      || replaceInvalidValues(data?.movement?.journey?.id),
      routeToUK: replaceInvalidValues(MovementUtil.movementRoute(journey)),
      arrival: {
        date: replaceInvalidValues(DateTimeUtil.format(MovementUtil.arrivalTime(journey), 'DD-MM-YYYY')),
        time: replaceInvalidValues(DateTimeUtil.format(MovementUtil.arrivalTime(journey), 'HH:mm')),
      },
    },
  };
};

const toPortNode = (data) => {
  if (data?.eventPort) {
    return {
      eventPort: data.eventPort,
    };
  }
};

const toIdNode = (data) => {
  if (data?.id) {
    return { businessKey: data.id };
  }
};

const toTisPrefillData = (data) => {
  let tisPrefillData = {};
  if (data) {
    tisPrefillData = {
      ...tisPrefillData,
      ...toIdNode(data),
      ...toPortNode(data),
      ...toMovementNode(data),
      ...toPersonNode(data),
      ...toOperationNode(data),
      ...toTargetingIndicatorsNode(data),
      ...toCategoryNode(data),
      ...toWarningsNode(data),
    };
  }
  return tisPrefillData;
};

const TargetInformationUtil = {
  transform: toTisPrefillData,
};

export default TargetInformationUtil;
