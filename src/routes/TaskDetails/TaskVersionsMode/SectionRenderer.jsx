import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { formatKey, formatField, formatLinkField } from '../../../utils/formatField';
import { RORO_UNACCOMPANIED_FREIGHT, RORO_ACCOMPANIED_FREIGHT, RORO_TOURIST_GROUP_ICON, RORO_TOURIST_SINGLE_ICON, RORO_TOURIST } from '../../../constants';
import { isValid, hasZeroCount, hasDriver, hasTaskVersionPassengers, hasTaskVersionValidCounts } from '../../../utils/roroDataUtil';

const findLink = (contents, content, linkPropNames) => {
  const linkPropName = linkPropNames[content.propName];
  if (!linkPropName) {
    return null;
  }
  return contents.find((field) => field.propName === linkPropName)?.content;
};

const renderFields = (contents, linkPropNames = {}, className = 'govuk-task-details-grid-item') => {
  return contents.map((content) => {
    if (!content.type.includes('HIDDEN')) {
      const link = findLink(contents, content, linkPropNames);
      return (
        <div className={className} key={uuidv4()}>
          <ul>
            <li className="govuk-grid-key font__light">{formatKey(content.type, content.fieldName)}</li>
            <li className="govuk-grid-value font__bold">{link ? formatLinkField(content.type, content.content, link) : formatField(content.type, content.content)}</li>
          </ul>
        </div>
      );
    }
  });
};

const renderVersionSection = ({ fieldSetName, contents }, linkPropNames = {}) => {
  if (contents !== undefined && contents !== null && contents.length > 0) {
    const jsxElement = renderFields(contents, linkPropNames);
    return (
      <div className="task-details-container bottom-border-thick">
        <h3 className="title-heading">{fieldSetName}</h3>
        <div className="govuk-task-details-grid-column">
          {jsxElement}
        </div>
      </div>
    );
  }
};

const renderVersionSectionBody = (fieldSet, linkPropNames = {}, className = '') => {
  if (fieldSet.length > 0 && fieldSet !== null && fieldSet !== undefined) {
    return renderFields(fieldSet, linkPropNames, className);
  }
};

const renderTargetingIndicatorsSection = ({ type, hasChildSet, childSets }) => {
  if (hasChildSet) {
    const targetingIndicators = childSets.map((childSet, index) => {
      const indicator = childSet.contents.filter(({ propName }) => propName === 'userfacingtext')[0].content;
      const score = childSet.contents.filter(({ propName }) => propName === 'score')[0].content;
      if (!type.includes('HIDDEN')) {
        const className = index !== childSets.length - 1 ? 'govuk-task-details-grid-row bottom-border' : 'govuk-task-details-grid-row';
        return (
          <div className={className} key={uuidv4()}>
            <ul className="list-bullet-container">
              {type.includes('CHANGED') ? <li className="govuk-grid-key list-bullet font__light task-versions--highlight">{indicator}</li> : <li className="govuk-grid-key list-bullet font__light">{indicator}</li>}
            </ul>
            <span className="govuk-grid-value font__bold">{formatField(type, score)}</span>
          </div>
        );
      }
    });
    if (targetingIndicators.length > 0) {
      return (
        <>
          <div className="govuk-task-details-indicator-container">
            <div className="govuk-task-details-grid-row bottom-border">
              <span className="govuk-grid-key font__light">Indicator</span>
              <span className="govuk-grid-value font__light">Score</span>
            </div>
            <div className="task-details-container">
              {targetingIndicators}
            </div>
          </div>
        </>
      );
    }
  }
};

const renderVehicleSection = ({ contents }, movementMode) => {
  if (movementMode !== RORO_UNACCOMPANIED_FREIGHT.toUpperCase()) {
    if (contents.length > 0) {
      const vehicleArray = contents.filter(({ propName }) => {
        return propName === 'registrationNumber' || propName === 'make' || propName === 'model'
          || propName === 'type' || propName === 'registrationNationality' || propName === 'colour';
      });
      const linkPropNames = { registrationNumber: 'vehicleEntitySearchUrl' };
      const vehicleSection = renderVersionSectionBody(vehicleArray, linkPropNames);
      return (
        <div className="task-details-container bottom-border-thick">
          <h3 className="title-heading">Vehicle</h3>
          <div className="govuk-task-details-grid-column">
            {vehicleSection}
          </div>
        </div>
      );
    }
  }
};

const renderTrailerSection = ({ contents }, movementMode) => {
  if (movementMode === RORO_UNACCOMPANIED_FREIGHT.toUpperCase() || movementMode === RORO_ACCOMPANIED_FREIGHT.toUpperCase()) {
    const trailerDataArray = contents.filter(({ propName }) => {
      return propName === 'trailerRegistrationNumber' || propName === 'trailerType' || propName === 'trailerRegistrationNationality'
        || propName === 'trailerLength' || propName === 'trailerHeight' || propName === 'trailerEmptyOrLoaded';
    });
      // Check that trailer registration exists
    if (trailerDataArray[0].content !== null) {
      const linkPropNames = { trailerRegistrationNumber: 'trailerEntitySearchUrl' };
      const trailerSection = renderVersionSectionBody(trailerDataArray, linkPropNames);
      return (
        <div className="task-details-container bottom-border-thick">
          <h3 className="title-heading">Trailer</h3>
          <div className="govuk-task-details-grid-column">
            {trailerSection}
          </div>
        </div>
      );
    }
  }
};

const getOccupantsCategoryCountsFields = (manifestOccupantCategoryCounts) => {
  return manifestOccupantCategoryCounts.map((categoryCount, index) => {
    if (isValid(categoryCount)) {
      if (!categoryCount.type.includes('HIDDEN')) {
        const className = (index !== manifestOccupantCategoryCounts.length - 1 ? 'govuk-task-details-grid-row bottom-border' : 'govuk-task-details-grid-row');
        return (
          <div className={className} key={uuidv4()}>
            <ul>
              {categoryCount.type.includes('CHANGED')
                ? (<li className={`govuk-grid-value font__bold ${hasZeroCount(categoryCount.content) && 'font__grey'} task-versions--highlight`}>{categoryCount.fieldName}</li>)
                : (<li className={`govuk-grid-value  ${hasZeroCount(categoryCount.content) && 'font__grey'} font__bold`}>{categoryCount.fieldName}</li>)}
            </ul>
            {categoryCount.type.includes('CHANGED')
              ? (<span className={`govuk-grid-value font__bold ${hasZeroCount(categoryCount.content) && 'font__grey'} task-versions--highlight`}>{formatField(categoryCount.type, categoryCount.content)}</span>)
              : (<span className={`govuk-grid-value font__bold ${hasZeroCount(categoryCount.content) && 'font__grey'}`}>{formatField(categoryCount.type, categoryCount.content)}</span>)}
          </div>
        );
      }
    }
  });
};

const renderOccupantsCategoryCountSection = (driverField, passengersField, passengersMetadata, movementMode) => {
  if (passengersMetadata) {
    let occupantsCountJsxElement;
    if (movementMode === RORO_ACCOMPANIED_FREIGHT || movementMode === RORO_TOURIST) {
      const driverName = driverField.contents.find(({ propName }) => propName === 'name').content;
      let manifestOccupantCategoryCounts = passengersMetadata.contents.filter(({ propName }) => {
        return propName === 'infantCount' || propName === 'childCount'
      || propName === 'adultCount' || propName === 'oapCount';
      }).reverse();

      if (!hasDriver(driverName) && !hasTaskVersionPassengers(passengersField) && hasTaskVersionValidCounts(manifestOccupantCategoryCounts)) {
        occupantsCountJsxElement = getOccupantsCategoryCountsFields(manifestOccupantCategoryCounts);
      }

      if (hasDriver(driverName) && !hasTaskVersionPassengers(passengersField) && hasTaskVersionValidCounts(manifestOccupantCategoryCounts)) {
        occupantsCountJsxElement = getOccupantsCategoryCountsFields(manifestOccupantCategoryCounts);
      }

      if (hasDriver(driverName) && !hasTaskVersionPassengers(passengersField) && !hasTaskVersionValidCounts(manifestOccupantCategoryCounts)) {
        manifestOccupantCategoryCounts = passengersMetadata.contents.filter(({ propName }) => { return propName === 'unknownCount'; });
        occupantsCountJsxElement = getOccupantsCategoryCountsFields(manifestOccupantCategoryCounts);
      }

      if (occupantsCountJsxElement) {
        return (
          <div className="govuk-task-details-counts-container">
            <div className="govuk-task-details-grid-row bottom-border">
              <span className="govuk-grid-key font__light">Category</span>
              <span className="govuk-grid-value font__light">Number</span>
            </div>
            <div className="task-details-container">
              {occupantsCountJsxElement}
            </div>
          </div>
        );
      }
    }
  }
};

const renderOccupantsSection = ({ fieldSetName, childSets }, movementModeIcon) => {
  const firstPassenger = childSets[0]?.contents;
  const remainingTravellers = childSets.slice(1);
  const otherPassengers = remainingTravellers.length > 0 ? remainingTravellers : undefined;
  let firstPassengerJsxElement;
  let otherPassengersJsxElementBlock;

  if (firstPassenger !== null && firstPassenger !== undefined) {
    if (firstPassenger.length > 0) {
      firstPassengerJsxElement = renderFields(firstPassenger);
      if (otherPassengers !== null && otherPassengers !== undefined) {
        if (otherPassengers.length > 0) {
          otherPassengersJsxElementBlock = otherPassengers.map((otherPassenger, index) => {
            const passengerJsxElement = renderFields(otherPassenger.contents);
            const className = index !== otherPassengers.length - 1 ? 'govuk-task-details-grid-column bottom-border' : 'govuk-task-details-grid-column';
            return (
              <div className={className} key={uuidv4()}>
                {passengerJsxElement}
              </div>
            );
          });
        }
      }
      return (
        <>
          <div className="task-details-container">
            {movementModeIcon !== RORO_TOURIST_GROUP_ICON && <h3 className="title-heading">{fieldSetName}</h3>}
            <div className="govuk-task-details-grid-column">
              {firstPassengerJsxElement}
            </div>
            {otherPassengersJsxElementBlock && (
            <details className="govuk-details" data-module="govuk-details">
              <summary className="govuk-details__summary">
                <span className="govuk-details__summary-text">
                  Show more
                </span>
              </summary>
              <div className="govuk-hidden-passengers">
                {otherPassengersJsxElementBlock}
              </div>
            </details>
            )}
          </div>
        </>
      );
    }
  }
};

const renderPrimaryTraveller = (driverField, movementModeIcon) => {
  const primaryTraveller = driverField.contents;
  if (primaryTraveller.length > 0) {
    let primaryTravellerArray;
    if (movementModeIcon === RORO_TOURIST_SINGLE_ICON) {
      primaryTravellerArray = primaryTraveller.filter(({ propName }) => {
        return propName === 'name' || propName === 'dob' || propName === 'gender'
            || propName === 'nationality' || propName === 'docType' || propName === 'docNumber'
            || propName === 'docExpiry';
      });
    } else {
      primaryTravellerArray = primaryTraveller.filter(({ propName }) => {
        return propName === 'name' || propName === 'dob' || propName === 'gender'
            || propName === 'nationality';
      });
    }
    const primaryTravellerSection = renderVersionSectionBody(primaryTravellerArray);
    return (
      <div className="task-details-container bottom-border-thick">
        <h3 className="title-heading">Primary Traveller</h3>
        <div className="govuk-task-details-grid-column">
          {primaryTravellerSection}
        </div>
      </div>
    );
  }
};

const renderPrimaryTravellerDocument = (driverField) => {
  const primaryTraveller = driverField.contents;
  if (primaryTraveller.length > 0) {
    const primaryTravellerDocumentArray = primaryTraveller.filter(({ propName }) => {
      return propName === 'docType' || propName === 'docNumber'
          || propName === 'docExpiry';
    });
    const primaryTravellerDocumentSection = renderVersionSectionBody(primaryTravellerDocumentArray);
    return (
      <div className="task-details-container bottom-border-thick">
        <h3 className="title-heading">Document</h3>
        <div className="govuk-task-details-grid-column">
          {primaryTravellerDocumentSection}
        </div>
      </div>
    );
  }
};

export { renderVersionSection,
  renderTargetingIndicatorsSection,
  renderVehicleSection,
  renderTrailerSection,
  renderOccupantsSection,
  renderOccupantsCategoryCountSection,
  renderPrimaryTraveller,
  renderPrimaryTravellerDocument };
