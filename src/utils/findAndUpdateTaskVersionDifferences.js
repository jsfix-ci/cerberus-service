const compareTaskVersions = (versionA, versionB, differencesCounts, differencesIdx) => {
  if (!Array.isArray(versionA) && typeof versionA === 'object' && versionA?.childSets && versionA.contents.length > 0) {
    versionA.contents.forEach((e, i) => {
      if (e.content !== versionB?.contents[i]?.content && e.type !== 'HIDDEN') {
        e.type = `${e.type}-CHANGED`;
        differencesCounts[differencesIdx] += 1;
      }
    });
    compareTaskVersions(versionA.childSets, versionB.childSets, differencesCounts, differencesIdx);
  } else if (!Array.isArray(versionA) && typeof versionA === 'object' && versionA?.contents.length > 0) {
    versionA.contents.forEach((e, i) => {
      if (e.content !== versionB?.contents[i]?.content && e.type !== 'HIDDEN') {
        e.type = `${e.type}-CHANGED`;
        differencesCounts[differencesIdx] += 1;
      }
    });
  } else if (Array.isArray(versionA)) {
    versionA.forEach((e, i) => compareTaskVersions(e, versionB[i], differencesCounts, differencesIdx));
  }
};

export default (taskVersions) => {
  const differencesCounts = [0];
  let wasUpdated = false;
  if (taskVersions.length >= 2) {
    wasUpdated = true;
    for (let i = 0; i < taskVersions.length - 1; i += 1) {
      const taskVersionA = taskVersions[i].filter((fieldSet) => {
        return !['targetingIndicators', 'selectors', 'rules'].includes(fieldSet.propName);
      });
      const taskVersionB = taskVersions[i + 1].filter((fieldSet) => {
        return !['targetingIndicators', 'selectors', 'rules'].includes(fieldSet.propName);
      });
      differencesCounts.push(0);
      compareTaskVersions(taskVersionA, taskVersionB, differencesCounts, i);
    }
  }
  return {
    wasUpdated,
    differencesCounts,
  };
};
