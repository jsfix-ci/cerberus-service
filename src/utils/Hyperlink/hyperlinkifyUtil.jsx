import React from 'react';
import { v4 as uuidv4 } from 'uuid';

const hyperlinkify = (str) => {
  return str
    .split(/(\[.*?\))/g)
    .map((word) => {
      const isHyperLink = word.match(/\[.*?\)/g);
      if (isHyperLink) {
        const displayText = word.match(/\[(.*?)\]/)[1];
        const url = word.match(/\((.*?)\)/)[1];
        return (
          <a
            key={uuidv4()}
            href={url}
            className="govuk-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {displayText}
          </a>
        );
      }
      return word;
    });
};

const HyperlinkifyUtil = {
  hyperlinkify,
};

export default HyperlinkifyUtil;

export { hyperlinkify };
