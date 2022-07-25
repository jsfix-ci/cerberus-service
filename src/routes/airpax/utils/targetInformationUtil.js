import { UTC_DATE_FORMAT } from '../../../constants';
import { replaceInvalidValues } from '../../../utils/stringConversion';
import BaggageUtil from './baggageUtil';
import DateTimeUtil from './datetimeUtil';
import MovementUtil from './movementUtil';
import PersonUtil from './personUtil';
import RisksUtil from './risksUtil';

const toLocalCache = (key, payload) => {
  localStorage.setItem(key, JSON.stringify(payload));
};

const getLocalCache = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

const removeLocalCache = (key) => {
  localStorage.removeItem(key);
};

const toPersonSubmissionNode = (person, index) => {
  if (person) {
    return {
      ...index && { id: index + 1 },
      name: person?.name,
      dateOfBirth: replaceInvalidValues(DateTimeUtil.convertToUTC(person?.dateOfBirth, 'DD-MM-YYYY', UTC_DATE_FORMAT)),
      gender: person?.sex,
      document: {
        ...person?.document,
        number: person?.document?.documentNumber,
        expiry: replaceInvalidValues(DateTimeUtil.convertToUTC(person?.document?.documentExpiry, 'DD-MM-YYYY', UTC_DATE_FORMAT)),
      },
      nationality: person?.nationality,
      ...(person?.photograph && {
        photograph: {
          url: person?.photograph?.photograph?.url,
          approxPhotoTaken: person?.photograph?.date
            && replaceInvalidValues(DateTimeUtil.convertToUTC(person?.photograph?.date, 'DD-MM-YYYY', UTC_DATE_FORMAT)),
        },
      }),
    };
  }
};

const toRisksSubmissionNode = (formData) => {
  if (formData) {
    return {
      risks: {
        targetingIndicators: formData?.targetingIndicators,
        selector: {
          category: replaceInvalidValues(formData?.category?.name),
          groupReference: null,
          warning: {
            status: replaceInvalidValues(formData?.warnings?.identified.toUpperCase()),
            types: formData?.warnings?.type,
            detail: replaceInvalidValues(formData?.warnings?.details),
          },
        },
      },
    };
  }
};

const toSubmittingUserNode = (formData, keycloak) => {
  const form = formData?.form;
  if (form) {
    return {
      submittingUser: {
        name: replaceInvalidValues(`${keycloak.tokenParsed.given_name} ${keycloak.tokenParsed.family_name}`),
        email: replaceInvalidValues(form?.submittedBy),
      },
    };
  }
};

const toReasoningSubmissionNode = (formData) => {
  if (formData?.whySelected) {
    return {
      selectionReasoning: replaceInvalidValues(formData?.whySelected),
    };
  }
};

const toRemarksSubmissionNode = (formData) => {
  if (formData?.warnings?.targetActions) {
    return {
      remarks: replaceInvalidValues(formData?.warnings?.targetActions),
    };
  }
};

const toMovementSubmissionNode = (taskData, formData, airPaxRefDataMode) => {
  if (taskData && formData) {
    const journey = MovementUtil.movementJourney(taskData);
    return {
      movement: {
        id: taskData?.movement?.id,
        mode: taskData?.movement?.mode,
        refDataMode: airPaxRefDataMode,
        journey: {
          id: journey?.id,
          direction: journey?.direction,
          route: formData?.movement?.routeToUK,
          arrival: journey?.arrival,
          departure: journey?.departure,
        },
        flight: {
          seatNumber: formData?.person?.seatNumber,
        },
        person: toPersonSubmissionNode(formData?.person),
        otherPersons: formData?.otherPersons?.map((person, index) => toPersonSubmissionNode(person, index)) || [],
        baggage: {
          numberOfCheckedBags: formData?.person?.baggage?.bagCount,
          weight: formData?.person?.baggage?.weight,
          tags: formData?.person?.baggage?.tags,
        },
      },
    };
  }
};

const toTargetReceiptTeamNode = (formData) => {
  if (formData?.teamToReceiveTheTarget) {
    return {
      teamToReceiveTheTarget: formData.teamToReceiveTheTarget,
    };
  }
};

const toNorminalChecksNode = (formData) => {
  if (formData?.nominalChecks?.length) {
    return {
      nominalChecks: formData?.nominalChecks,
    };
  }
  return { nominalChecks: [{}] };
};

const toWarningsNode = (formData) => {
  const risks = RisksUtil.getRisks(formData);
  if (risks?.selector) {
    const warning = risks?.selector?.warning;
    if (warning) {
      return {
        warnings: {
          identified: replaceInvalidValues(warning?.status?.toLowerCase()),
          type: warning?.types,
          details: replaceInvalidValues(warning?.detail),
          targetActions: replaceInvalidValues(formData?.remarks),
        },
      };
    }
  }
};

const toCategoryNode = (formData) => {
  const risks = RisksUtil.getRisks(formData);
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

const toTargetingIndicatorsNode = (formData) => {
  const risks = RisksUtil.getRisks(formData);
  const targetingIndicators = RisksUtil.getIndicators(risks);
  if (targetingIndicators?.length) {
    return {
      targetingIndicators: targetingIndicators.map((ti) => {
        return {
          ...ti,
          value: ti.id,
          label: ti.userfacingtext,
        };
      }),
    };
  }
};

const toOperationNode = (formData) => {
  if (formData?.operation) {
    return {
      operation: replaceInvalidValues(formData.operation),
    };
  }
};

const toPersonNode = (person, index) => {
  if (person) {
    return {
      id: index + 1,
      name: { ...person?.name },
      dateOfBirth: replaceInvalidValues(DateTimeUtil.format(person?.dateOfBirth, 'DD-MM-YYYY')),
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
    };
  }
};

const toOtherPersonsNode = (data) => {
  const othersPersons = PersonUtil.getOthers(data);
  if (othersPersons?.length) {
    return {
      otherPersons: othersPersons.map((person, index) => toPersonNode(person, index)),
    };
  }
};

const toMainPersonNode = (data) => {
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

const toMovementNode = (formData) => {
  const flight = MovementUtil.movementFlight(formData);
  const journey = MovementUtil.movementJourney(formData);
  return {
    movement: {
      flightNumber: replaceInvalidValues(MovementUtil.flightNumber(flight))
        || replaceInvalidValues(formData?.movement?.journey?.id),
      routeToUK: replaceInvalidValues(MovementUtil.movementRoute(journey)),
      arrival: {
        date: replaceInvalidValues(DateTimeUtil.format(MovementUtil.arrivalTime(journey), 'DD-MM-YYYY')),
        time: replaceInvalidValues(DateTimeUtil.format(MovementUtil.arrivalTime(journey), 'HH:mm')),
      },
    },
  };
};

const toIssuingHubNode = (formData) => {
  if (formData?.issuingHub) {
    return {
      issuingHub: formData.issuingHub,
    };
  }
  return {
    issuingHub: null,
  };
};

const toPortNode = (formData) => {
  if (formData?.eventPort) {
    return {
      eventPort: formData.eventPort,
    };
  }
};

const toIdNode = (formData) => {
  if (formData?.id) {
    return { id: formData.id };
  }
};

const toTisPrefillPayload = (informationSheet) => {
  let tisPrefillData = {};
  if (informationSheet) {
    tisPrefillData = {
      ...tisPrefillData,
      ...toIdNode(informationSheet),
      ...toPortNode(informationSheet),
      ...toMovementNode(informationSheet),
      ...toIssuingHubNode(informationSheet),
      ...toMainPersonNode(informationSheet),
      ...toOtherPersonsNode(informationSheet),
      ...toOperationNode(informationSheet),
      ...toTargetingIndicatorsNode(informationSheet),
      ...toCategoryNode(informationSheet),
      ...toWarningsNode(informationSheet),
      ...toNorminalChecksNode(informationSheet),
      ...toTargetReceiptTeamNode(informationSheet),
    };
  }
  return tisPrefillData;
};

const toTisSubmissionPayload = (taskData, formData, keycloak, airPaxRefDataMode) => {
  let submissionPayload = {};
  if (formData) {
    submissionPayload = {
      ...submissionPayload,
      ...toIdNode(formData),
      ...toPortNode(formData),
      ...toMovementSubmissionNode(taskData, formData, airPaxRefDataMode),
      ...toIssuingHubNode(formData),
      ...toTargetReceiptTeamNode(formData),
      ...toRemarksSubmissionNode(formData),
      ...toReasoningSubmissionNode(formData),
      ...toOperationNode(formData),
      ...toSubmittingUserNode(formData, keycloak),
      ...toRisksSubmissionNode(formData),
      ...toNorminalChecksNode(formData),
      form: {
        ...formData?.form,
      },
    };
  }
  return submissionPayload;
};

const submissionToPrefillPayload = (formData) => {
  if (formData) {
    return {
      id: formData?.id,
      businessKey: formData?.businessKey,
      movement: formData?.movement,
      issuingHub: formData?.issuingHub,
      person: formData?.person,
      otherPersons: formData?.otherPersons,
      category: formData?.category,
      warnings: formData?.warnings,
      nominalChecks: formData?.nominalChecks,
      eventPort: formData?.eventPort,
      formStatus: formData?.formStatus,
      meta: formData?.meta,
      targetingIndicators: formData?.targetingIndicators,
      teamToReceiveTheTarget: formData?.teamToReceiveTheTarget,
      form: formData?.form,
    };
  }
};

const TargetInformationUtil = {
  prefillPayload: toTisPrefillPayload,
  submissionPayload: toTisSubmissionPayload,
  convertToPrefill: submissionToPrefillPayload,
  cache: {
    get: getLocalCache,
    remove: removeLocalCache,
    store: toLocalCache,
  },
};

export default TargetInformationUtil;

export { toTisPrefillPayload, toTisSubmissionPayload };
