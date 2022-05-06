import React from 'react';
import { MovementUtil } from '../../utils';

const Itinerary = ({ version }) => {
  const itinerary = MovementUtil.movementItinerary(MovementUtil.movementJourney(version));
  const itineraryBlocks = MovementUtil.itineraryBlock(itinerary);
  return (
    <div className="task-details-container">
      <h3 className="title-heading airpax-title-heading">Itinerary</h3>
      <div className="thin-border" />
      {itineraryBlocks.map((itineraryBlock, index) => {
        return (
          <div key={index} className={`${index !== itineraryBlock.length - 1 && 'thin-border'} govuk-!-margin-top-1`}>
            {itineraryBlock}
          </div>
        );
      })}
    </div>
  );
};

export default Itinerary;
