import { DATE_FORMATS, MOVEMENT_MODES } from '../constants';

import AccountUtil from '../Account/accountUtil';
import BaggageUtil from '../Baggage/baggageUtil';
import DateTimeUtil from '../Datetime/datetimeUtil';
import MovementUtil from '../Movement/movementUtil';
import PersonUtil from '../Person/personUtil';
import RisksUtil from '../Risks/risksUtil';
import JourneyUtil from '../Journey/journeyUtil';
import GoodsUtil from '../Goods/goodsUtil';
import HaulierUtil from '../Haulier/haulierUtil';
import ConsigneeUtil from '../Goods/consigneeUtil';
import ConsignorUtil from '../Goods/consignorUtil';
import VesselUtil from '../Vessel/vesselUtil';
import { replaceInvalidValues } from '../String/stringUtil';

export const DIRECTION = {
  INBOUND: 'INBOUND',
  OUTBOUND: 'OUTBOUND',
};

const RORO_MODES = [
  MOVEMENT_MODES.ACCOMPANIED_FREIGHT,
  MOVEMENT_MODES.UNACCOMPANIED_FREIGHT,
  MOVEMENT_MODES.TOURIST];

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

const toInformFreightAndTouristSubmissionNode = (formData) => {
  const informFreightAndTourist = formData?.informFreightAndTourist;
  if (informFreightAndTourist && informFreightAndTourist?.length) {
    return {
      informFreightAndTourist: true,
    };
  }
  return false;
};

const toControlStrategySubmissionNode = (formData) => {
  return {
    controlStrategies: formData?.preArrival?.controlStrategy || [],
  };
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
          groupReference: replaceInvalidValues(formData?.warnings?.groupReference),
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
  const whySelected = formData?.whySelected || formData?.preArrival?.whySelected;
  if (whySelected) {
    return {
      selectionReasoning: replaceInvalidValues(whySelected),
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
      poleId: person?.id,
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

const toMovementSubmissionNode = (taskData, formData) => {
  if (taskData && formData) {
    const journey = JourneyUtil.get(taskData);
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
        refDataMode: formData?.refDataMode,
        journey: {
          id: journey?.id,
          direction: formData?.movement?.direction,
          arrivalTime: arrivalDateTime,
          departureTime: departureDateTime,
          route: formData?.movement?.route,
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
        vessel: {
          operator: replaceInvalidValues(formData?.interception?.shippingCompany),
          name: replaceInvalidValues(formData?.interception?.vesselName),
        },
        vehicle: formData?.vehicle,
        trailer: formData?.trailer,
        goods: {
          description: formData?.goods?.load,
          weight: formData?.goods?.weight,
          destination: formData?.goods?.destinationCountry,
        },
        account: {
          name: formData?.preArrival?.accountName,
          number: formData?.preArrival?.accountNumber,
        },
        haulier: {
          name: replaceInvalidValues(formData?.goods?.haulier?.name),
          line1: replaceInvalidValues(formData?.goods?.haulier?.line1),
          line2: replaceInvalidValues(formData?.goods?.haulier?.line2),
          line3: replaceInvalidValues(formData?.goods?.haulier?.line3),
          city: replaceInvalidValues(formData?.goods?.haulier?.city),
          postcode: replaceInvalidValues(formData?.goods?.haulier?.postcode),
          country: replaceInvalidValues(formData?.goods?.haulier?.country),
        },
        consignee: {
          name: replaceInvalidValues(formData?.goods?.consignee?.name),
          line1: replaceInvalidValues(formData?.goods?.consignee?.line1),
          line2: replaceInvalidValues(formData?.goods?.consignee?.line2),
          line3: replaceInvalidValues(formData?.goods?.consignee?.line3),
          city: replaceInvalidValues(formData?.goods?.consignee?.city),
          postcode: replaceInvalidValues(formData?.goods?.consignee?.postcode),
          country: replaceInvalidValues(formData?.goods?.consignee?.country),
        },
        consignor: {
          name: replaceInvalidValues(formData?.goods?.consignor?.name),
          line1: replaceInvalidValues(formData?.goods?.consignor?.line1),
          line2: replaceInvalidValues(formData?.goods?.consignor?.line2),
          line3: replaceInvalidValues(formData?.goods?.consignor?.line3),
          city: replaceInvalidValues(formData?.goods?.consignor?.city),
          postcode: replaceInvalidValues(formData?.goods?.consignor?.postcode),
          country: replaceInvalidValues(formData?.goods?.consignor?.country),
        },
      },
    };
  }
};

const toPortSubmissionNode = (formData) => {
  const direction = formData?.movement?.direction || formData?.direction;
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
          groupReference: replaceInvalidValues(risks?.selector?.groupReference),
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
  const targetingIndicators = RisksUtil.targetingIndicators(risks);
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

const toVehicleNode = (formData) => {
  if (formData?.movement?.vehicle) {
    return { vehicle: formData.movement.vehicle };
  }
};

const toTrailerNode = (formData) => {
  if (formData?.movement?.trailer) {
    return { trailer: formData.movement.trailer };
  }
};

const toGoodsNode = (formData) => {
  const goods = GoodsUtil.get(formData);
  const consignee = ConsigneeUtil.get(formData);
  const consignor = ConsignorUtil.get(formData);
  const haulier = HaulierUtil.get(formData);
  if (goods) {
    return {
      goods: {
        load: replaceInvalidValues(goods?.description),
        weight: replaceInvalidValues(goods?.weight),
        destinationCountry: goods?.destination,
        detailsAvailable: [
          ...(consignee ? ['consignee'] : []),
          ...(consignor ? ['consignor'] : []),
          ...(haulier ? ['haulier'] : []),
        ],
        ...(consignor && { consignor: {
          name: replaceInvalidValues(consignor?.name),
          line1: replaceInvalidValues(consignor?.line1),
          line2: replaceInvalidValues(consignor?.line2),
          line3: replaceInvalidValues(consignor?.line3),
          city: replaceInvalidValues(consignor?.city),
          postcode: replaceInvalidValues(consignor?.postcode),
          country: replaceInvalidValues(consignor?.country),
        } }
        ),
        ...(consignee && { consignee: {
          name: replaceInvalidValues(consignee?.name),
          line1: replaceInvalidValues(consignee?.line1),
          line2: replaceInvalidValues(consignee?.line2),
          line3: replaceInvalidValues(consignee?.line3),
          city: replaceInvalidValues(consignee?.city),
          postcode: replaceInvalidValues(consignee?.postcode),
          country: replaceInvalidValues(consignee?.country),
        } }),
        ...(haulier && { haulier: {
          name: replaceInvalidValues(haulier?.name),
          line1: replaceInvalidValues(haulier?.line1),
          line2: replaceInvalidValues(haulier?.line2),
          line3: replaceInvalidValues(haulier?.line3),
          city: replaceInvalidValues(haulier?.city),
          postcode: replaceInvalidValues(haulier?.postcode),
          country: replaceInvalidValues(haulier?.country),
        } }),
      },
    };
  }
};

const toPreArrivalNode = (formData) => {
  const account = AccountUtil.get(formData);
  if (formData?.selectionReasoning) {
    return {
      preArrival: {
        accountName: replaceInvalidValues(AccountUtil.name(account)),
        accountNumber: replaceInvalidValues(AccountUtil.number(account)),
        whySelected: replaceInvalidValues(formData?.selectionReasoning),
      },
    };
  }
};

const toInterceptionNode = (formData) => {
  const vessel = VesselUtil.get(formData);
  const journey = JourneyUtil.get(formData);
  return {
    interception: {
      vesselName: replaceInvalidValues(VesselUtil.name(vessel)),
      shippingCompany: replaceInvalidValues(VesselUtil.operator(vessel)),
      arrival: {
        date: replaceInvalidValues(DateTimeUtil.format(JourneyUtil.arrivalTime(journey), 'DD-MM-YYYY')),
        time: replaceInvalidValues(DateTimeUtil.format(JourneyUtil.arrivalTime(journey), 'HH:mm')),
      },
      departure: {
        date: replaceInvalidValues(DateTimeUtil.format(JourneyUtil.departureTime(journey), 'DD-MM-YYYY')),
        time: replaceInvalidValues(DateTimeUtil.format(JourneyUtil.departureTime(journey), 'HH:mm')),
      },
    },
  };
};

const toMovementNode = (formData) => {
  const journey = JourneyUtil.get(formData);
  const mode = MovementUtil.movementMode(formData);
  return {
    movement: {
      id: replaceInvalidValues(formData?.movement?.id),
      ...(!RORO_MODES.includes(mode) && { flightNumber: replaceInvalidValues(formData?.movement?.journey?.id) }),
      route: replaceInvalidValues(JourneyUtil.movementRoute(journey)),
      direction: replaceInvalidValues(JourneyUtil.direction(journey)),
      arrival: {
        date: replaceInvalidValues(DateTimeUtil.format(JourneyUtil.arrivalTime(journey), 'DD-MM-YYYY')),
        time: replaceInvalidValues(DateTimeUtil.format(JourneyUtil.arrivalTime(journey), 'HH:mm')),
      },
      departure: {
        date: replaceInvalidValues(DateTimeUtil.format(JourneyUtil.departureTime(journey), 'DD-MM-YYYY')),
        time: replaceInvalidValues(DateTimeUtil.format(JourneyUtil.departureTime(journey), 'HH:mm')),
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

const toDirectionNode = (formData) => {
  const journey = JourneyUtil.get(formData);
  if (journey?.direction) {
    return { direction: journey?.direction };
  }
};

const toPortNode = (formData) => {
  const direction = JourneyUtil.direction(formData?.movement?.journey);
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

const toRefDataModeNode = (formData) => {
  if (formData?.movement?.refDataMode) {
    return { refDataMode: formData.movement.refDataMode };
  }
};

const toModeNode = (formData) => {
  if (formData?.movement?.mode) {
    return { mode: formData?.movement?.mode };
  }
};

// This is also the task-id
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
      ...toModeNode(informationSheet),
      ...toRefDataModeNode(informationSheet),
      ...toDirectionNode(informationSheet),
      ...toInterceptionNode(informationSheet),
      ...toPortNode(informationSheet),
      ...toVehicleNode(informationSheet),
      ...toTrailerNode(informationSheet),
      ...toGoodsNode(informationSheet),
      ...toMovementNode(informationSheet),
      ...toIssuingHubNode(informationSheet),
      ...toMainPersonNode(informationSheet),
      ...toOtherPersonsNode(informationSheet),
      ...toReasoningNode(informationSheet),
      ...toPreArrivalNode(informationSheet),
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

const toTisSubmissionPayload = (taskData, formData, keycloak) => {
  let submissionPayload = {};
  if (formData) {
    submissionPayload = {
      ...toIdNode(formData),
      ...toPortSubmissionNode(formData),
      ...toMovementSubmissionNode(taskData, formData),
      ...toRemarksSubmissionNode(formData),
      ...toReasoningSubmissionNode(formData),
      ...toRisksSubmissionNode(formData),
      ...toControlStrategySubmissionNode(formData),
      ...toNominalChecksSubmissionNode(formData),
      ...toIssuingHubNode(formData),
      ...toTargetReceiptTeamNode(formData),
      ...toOperationNode(formData),
      ...toInformFreightAndTouristSubmissionNode(formData),
      ...toSubmittingUserNode(formData, keycloak),
      form: {
        ...formData?.form,
      },
    };
  }
  return submissionPayload;
};

const formDataToPrefillPayload = (formData) => {
  console.log('FORM DATA TO PREFILL DATA: ', formData);
  let tisPrefillData = {};
  if (formData) {
    tisPrefillData = {
      ...(formData?.additionalInfo && { additionalInfo: formData?.additionalInfo }),
      ...(formData?.arrivalPort && { arrivalPort: formData?.arrivalPort }),
      ...(formData?.businessKey && { businessKey: formData?.businessKey }),
      ...(formData?.category && { category: formData?.category }),
      ...(formData?.departurePort && { departurePort: formData?.departurePort }),
      ...(formData?.direction && { direction: formData?.direction }),
      ...(formData?.form && { form: formData?.form }),
      ...(formData?.formStatus && { formStatus: formData?.formStatus }),
      ...(formData?.goods && { goods: formData?.goods }),
      ...(formData?.id && { id: formData?.id }),
      ...(formData?.informTouristFreight && { informTouristFreight: formData?.informTouristFreight }),
      ...(formData?.interception && { interception: formData?.interception }),
      ...(formData?.issuingHub && { issuingHub: formData?.issuingHub }),
      ...(formData?.meta && { meta: formData?.meta }),
      ...(formData?.mode && { mode: formData?.mode }),
      ...(formData?.movement && { movement: formData?.movement }),
      ...(formData?.nominalChecks?.length && { nominalChecks: formData?.nominalChecks }),
      ...(formData?.operation && { operation: formData?.operation }),
      ...(formData?.otherPersons?.length && { otherPersons: formData?.otherPersons.map((person) => addThumbUrl(person)) }),
      ...(formData?.person && { person: addThumbUrl(formData?.person) }),
      ...(formData?.preArrival && { preArrival: formData?.preArrival }),
      ...(formData?.refDataMode && { refDataMode: formData?.refDataMode }),
      ...(formData?.targetCategory && { targetCategory: formData?.targetCategory }),
      ...(formData?.targetingIndicators?.length && { targetingIndicators: formData?.targetingIndicators }),
      ...(formData?.teamToReceiveTheTarget && { teamToReceiveTheTarget: formData?.teamToReceiveTheTarget }),
      ...(formData?.trailer && { trailer: formData?.trailer }),
      ...(formData?.vehicle && { vehicle: formData?.vehicle }),
      ...(formData?.warnings && { warnings: formData?.warnings }),
      ...(formData?.whySelected && { whySelected: formData?.whySelected }),
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
