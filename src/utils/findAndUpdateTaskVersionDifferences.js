const compareTaskVersions = (versionA, versionB, differencesCounts, differencesIdx) => {
  /*
   * versionA is the "latest" version in whatever iteration compareTaskVersions is getting called in
   * versionB is the "latest" version - 1 in whatever iteration compareTaskVersions is getting called in
   * differencesCounts is the array where the number of differences between each version is recorded
   */

  /*
   * Check if versionA is an object containing childSets, loops through the contents of a fieldSet then
   * feeds it's respective childSets down recursively (which will then be picked up by the final else if)
   */
  if (!Array.isArray(versionA) && typeof versionA === 'object' && versionA?.childSets && versionA?.contents) {
    versionA.contents.forEach((e, i) => {
      // Avoid HIDDEN types as they are not pertinent changes for the user, thus irrelevant for versioning
      if (e.content !== versionB?.contents[i]?.content && e.type !== 'HIDDEN') {
        e.type = `${e.type}-CHANGED`;
        differencesCounts[differencesIdx] += 1;
      }
    });
    compareTaskVersions(versionA.childSets, versionB.childSets, differencesCounts, differencesIdx);
  /*
   * Below condition is for when a fieldSet ONLY has a contents prop, no recursion required as there are no nested
   * arrays here and a direct comparison between versionA and versionB arrays is all that is needed
   */
  } else if (!Array.isArray(versionA) && typeof versionA === 'object' && versionA?.contents) {
    versionA.contents.forEach((e, i) => {
      if (e.content !== versionB?.contents[i]?.content && e.type !== 'HIDDEN') {
        e.type = `${e.type}-CHANGED`;
        differencesCounts[differencesIdx] += 1;
      }
    });
  /*
   * As metioned above, the below condition is for when childSets (which are arrays) get passed down into a recursive
   * call.
   */
  } else if (Array.isArray(versionA)) {
    versionA.forEach((e, i) => compareTaskVersions(e, versionB[i], differencesCounts, differencesIdx));
  }
};

const findAndUpdateTaskVersionDifferences = (taskVersions) => {
  /*
   * differencesCounts will always match the length of the taskVersions array - this allows a mapping between index positions
   * of the taskVersions and the differencesCounts
   */
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

const findAndUpdateTaskVersionDifferencesAirPax = (taskVersions) => {
  /*
   * differencesCounts will always match the length of the taskVersions array - this allows a mapping between index positions
   * of the taskVersions and the differencesCounts
   */
  const differencesCounts = [0];
  let wasUpdated = false;
  if (taskVersions && taskVersions.length >= 2) {
    wasUpdated = true;
    for (let i = 0; i < taskVersions.length - 1; i += 1) {
      differencesCounts.push(0);
      compareTaskVersions(taskVersions[i], taskVersions[i + 1], differencesCounts, i);
    }
  }
  return {
    wasUpdated,
    differencesCounts,
  };
};

export { findAndUpdateTaskVersionDifferences, findAndUpdateTaskVersionDifferencesAirPax };
