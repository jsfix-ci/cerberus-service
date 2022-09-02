import { DATE_FORMATS } from '../constants';

import BaggageUtil from '../Baggage/baggageUtil';
import DateTimeUtil from '../Datetime/datetimeUtil';
import MovementUtil from '../Movement/movementUtil';
import PersonUtil from '../Person/personUtil';
import RisksUtil from '../Risks/risksUtil';
import { replaceInvalidValues } from '../String/stringUtil';

const DIRECTION = {
  INBOUND: 'INBOUND',
  OUTBOUND: 'OUTBOUND',
};

const addThumbUrl = (person) => {
  if (!person?.photograph?.url || !person?.photograph?.url?.startsWith('blob:')) {
    const file = person?.photograph?.file;
    if (file) {
      return {
        ...person,
        photograph: {
          ...person.photograph,
          url: URL.createObjectURL(file),
        },
      };
    }
  }
  return person;
};

const toNominalChecksSubmissionNode = (formData) => {
  return {
    nominalChecks: formData?.nominalChecks?.map((nominalCheck) => {
      return {
        type: nominalCheck.nominalType.value,
        checks: nominalCheck.systemsCheck,
        comments: nominalCheck.comments,
      };
    }) || [],
  };
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

const toPersonSubmissionNode = (person, meta, index) => {
  if (person) {
    return {
      id: person?.id,
      name: person?.name,
      dateOfBirth: replaceInvalidValues(DateTimeUtil.convertToUTC(person?.dateOfBirth, 'DD-MM-YYYY', DATE_FORMATS.UTC)),
      gender: person?.sex,
      document: {
        ...person?.document,
        number: person?.document?.documentNumber,
        expiry: replaceInvalidValues(DateTimeUtil.convertToUTC(person?.document?.documentExpiry, 'DD-MM-YYYY', DATE_FORMATS.UTC)),
      },
      nationality: person?.nationality,
      ...(person?.photograph && {
        photograph: {
          uri: (index || index === 0) ? replaceInvalidValues(meta?.documents[index + 1]?.url)
            : replaceInvalidValues(meta?.documents[0]?.url),
          approxPhotoTaken: person?.photographDate
            && replaceInvalidValues(DateTimeUtil.convertToUTC(person?.photographDate, 'DD-MM-YYYY', DATE_FORMATS.UTC)),
        },
      }),
    };
  }
};

const toMovementSubmissionNode = (taskData, formData, airPaxRefDataMode) => {
  if (taskData && formData) {
    const journey = MovementUtil.movementJourney(taskData);
    const arrivalDateTime = DateTimeUtil.convertToUTC(
      `${formData?.movement?.arrival?.date} ${formData?.movement?.arrival?.time}`, 'DD-MM-YYYY HH:mm', DATE_FORMATS.UTC,
    );
    const departureDateTime = DateTimeUtil.convertToUTC(
      `${formData?.movement?.departure?.date} ${formData?.movement?.departure?.time}`, 'DD-MM-YYYY HH:mm', DATE_FORMATS.UTC,
    );
    return {
      movement: {
        id: taskData?.movement?.id,
        mode: taskData?.movement?.mode,
        refDataMode: airPaxRefDataMode,
        journey: {
          id: journey?.id,
          direction: formData?.movement?.direction,
          route: formData?.movement?.routeToUK,
          arrival: {
            ...formData?.movement?.arrival,
            country: journey?.arrival?.country,
            location: journey?.arrival?.location,
            date: arrivalDateTime,
            time: arrivalDateTime,
          },
          departure: {
            ...formData?.movement?.departure,
            country: journey?.departure?.country,
            location: journey?.departure?.location,
            date: departureDateTime,
            time: departureDateTime,
          },
        },
        flight: {
          seatNumber: formData?.person?.seatNumber,
        },
        person: toPersonSubmissionNode(formData?.person, formData?.meta),
        otherPersons: formData?.otherPersons?.map((person, index) => toPersonSubmissionNode(person, formData?.meta, index)) || [],
        baggage: {
          numberOfCheckedBags: formData?.person?.baggage?.bagCount,
          weight: formData?.person?.baggage?.weight,
          tags: formData?.person?.baggage?.tags,
        },
      },
    };
  }
};

const toPortSubmissionNode = (formData) => {
  const direction = formData?.movement?.direction;
  if (direction === DIRECTION.INBOUND && formData?.movement?.arrivalPort) {
    return {
      eventPort: formData.movement.arrivalPort,
    };
  }
  if (direction === DIRECTION.OUTBOUND && formData?.movement?.departurePort) {
    return {
      eventPort: formData.movement.departurePort,
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

const toNominalChecksNode = (formData) => {
  if (formData?.nominalChecks?.length) {
    return {
      nominalChecks: formData?.nominalChecks,
    };
  }
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

const toReasoningNode = (formData) => {
  if (formData?.selectionReasoning) {
    return {
      selectionReasoning: replaceInvalidValues(formData?.selectionReasoning),
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

const toPersonNode = (person) => {
  if (person) {
    return {
      id: person?.id,
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
      otherPersons: othersPersons.map((person) => toPersonNode(person)),
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
        id: person?.id,
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
      direction: replaceInvalidValues(MovementUtil.direction(journey)),
      arrival: {
        date: replaceInvalidValues(DateTimeUtil.format(MovementUtil.arrivalTime(journey), 'DD-MM-YYYY')),
        time: replaceInvalidValues(DateTimeUtil.format(MovementUtil.arrivalTime(journey), 'HH:mm')),
      },
      departure: {
        date: replaceInvalidValues(DateTimeUtil.format(MovementUtil.departureTime(journey), 'DD-MM-YYYY')),
        time: replaceInvalidValues(DateTimeUtil.format(MovementUtil.departureTime(journey), 'HH:mm')),
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
  const direction = MovementUtil.direction(formData?.movement?.journey);
  if (direction === DIRECTION.INBOUND && formData?.eventPort) {
    return {
      arrivalPort: formData.eventPort,
    };
  }
  if (direction === DIRECTION.OUTBOUND && formData?.eventPort) {
    return {
      departurePort: formData.eventPort,
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
      ...toIdNode(informationSheet),
      ...toPortNode(informationSheet),
      ...toMovementNode(informationSheet),
      ...toIssuingHubNode(informationSheet),
      ...toMainPersonNode(informationSheet),
      ...toOtherPersonsNode(informationSheet),
      ...toReasoningNode(informationSheet),
      ...toOperationNode(informationSheet),
      ...toTargetingIndicatorsNode(informationSheet),
      ...toCategoryNode(informationSheet),
      ...toWarningsNode(informationSheet),
      ...toNominalChecksNode(informationSheet),
      ...toTargetReceiptTeamNode(informationSheet),
    };
  }
  return tisPrefillData;
};

const toTisSubmissionPayload = (taskData, formData, keycloak, airPaxRefDataMode) => {
  let submissionPayload = {};
  if (formData) {
    submissionPayload = {
      ...toIdNode(formData),
      ...toPortSubmissionNode(formData),
      ...toMovementSubmissionNode(taskData, formData, airPaxRefDataMode),
      ...toIssuingHubNode(formData),
      ...toTargetReceiptTeamNode(formData),
      ...toRemarksSubmissionNode(formData),
      ...toReasoningSubmissionNode(formData),
      ...toOperationNode(formData),
      ...toSubmittingUserNode(formData, keycloak),
      ...toRisksSubmissionNode(formData),
      ...toNominalChecksSubmissionNode(formData),
      form: {
        ...formData?.form,
      },
    };
  }
  return submissionPayload;
};

const formDataToPrefillPayload = (formData) => {
  let tisPrefillData = {};
  if (formData) {
    tisPrefillData = {
      ...(formData?.id && { id: formData?.id }),
      ...(formData?.businessKey && { businessKey: formData?.businessKey }),
      ...(formData?.movement && { movement: formData?.movement }),
      ...(formData?.issuingHub && { issuingHub: formData?.issuingHub }),
      ...(formData?.person && { person: addThumbUrl(formData?.person) }),
      ...(formData?.otherPersons?.length
        && { otherPersons: formData?.otherPersons.map((person) => addThumbUrl(person)) }),
      ...(formData?.category && { category: formData?.category }),
      ...(formData?.warnings && { warnings: formData?.warnings }),
      ...(formData?.nominalChecks?.length && { nominalChecks: formData?.nominalChecks }),
      ...(formData?.formStatus && { formStatus: formData?.formStatus }),
      ...(formData?.meta && { meta: formData?.meta }),
      ...(formData?.operation && { operation: formData?.operation }),
      ...(formData?.targetingIndicators?.length && { targetingIndicators: formData?.targetingIndicators }),
      ...(formData?.additionalInfo && { additionalInfo: formData?.additionalInfo }),
      ...(formData?.whySelected && { whySelected: formData?.whySelected }),
      ...(formData?.teamToReceiveTheTarget && { teamToReceiveTheTarget: formData?.teamToReceiveTheTarget }),
      ...(formData?.form && { form: formData?.form }),
    };
  }
  return tisPrefillData;
};

const TargetInformationUtil = {
  prefillPayload: toTisPrefillPayload,
  submissionPayload: toTisSubmissionPayload,
  convertToPrefill: formDataToPrefillPayload,
};

export default TargetInformationUtil;

export { toTisPrefillPayload, toTisSubmissionPayload, formDataToPrefillPayload };
