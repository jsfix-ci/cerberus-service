const compareTaskVersions = (versionOne, versionTwo) => {
  if (!Array.isArray(versionOne) && typeof versionOne === 'object' && versionOne?.childSets && versionOne.contents.length > 0) {
    versionOne.contents.forEach((e, i) => {
      if (e.content !== versionTwo?.contents[i]?.content) {
        e.type = `${e.type}-CHANGED`;
      }
    });
    compareTaskVersions(versionOne.childSets, versionTwo.childSets);
  } else if (!Array.isArray(versionOne) && typeof versionOne === 'object' && versionOne?.contents.length > 0) {
    versionOne.contents.forEach((e, i) => {
      if (e.content !== versionTwo?.contents[i]?.content) {
        e.type = `${e.type}-CHANGED`;
      }
    });
  } else if (Array.isArray(versionOne)) {
    versionOne.forEach((e, i) => compareTaskVersions(e, versionTwo[i]));
  }
};

export default (taskVersions) => {
  for (let i = 0; i < taskVersions.length - 1; i += 1) {
    const a = taskVersions[i].filter((fieldSet) => {
      return !['targetingIndicators', 'selectors', 'rules'].includes(fieldSet.propName);
    });
    const b = taskVersions[i + 1].filter((fieldSet) => {
      return !['targetingIndicators', 'selectors', 'rules'].includes(fieldSet.propName);
    });
    compareTaskVersions(a, b);
  }
};
