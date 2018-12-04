let guardData = {};
let currGuardId = "";
let currGuardTotalSleep = 0;
let currGuardSleep = {};

window.onload = async () => {
  const data = await fetch("./data.txt")
    .then(response => response.text())
    .then(text => text.split("\n").sort());

  const findGuardId = string => string.match(/#(\d+)\s/)[1];
  const findTime = string => string.match(/\[(.*?)\]/)[1].split(" ")[1];
  const findState = string => string.match(/\](.*)/)[1].trim();

  data.forEach((string, i, array) => {
    const state = findState(string);

    if (array[i + 1] === undefined || array[i + 1].includes("Guard")) {
      // Nästa iteration är en ny vakt / Detta är sista iterationen
      // Pusha vår buffer till guardData

      if (guardData[currGuardId]) {
        // Vakten finns redan i objektet
        guardData[currGuardId].totalSleep =
          guardData[currGuardId].totalSleep + currGuardTotalSleep;
        Object.keys(currGuardSleep).forEach(timeStamp => {
          guardData[currGuardId].sleep[timeStamp] = guardData[currGuardId]
            .sleep[timeStamp]
            ? guardData[currGuardId].sleep[timeStamp] +
              currGuardSleep[timeStamp]
            : currGuardSleep[timeStamp];
        });
      } else {
        // Ny vakt
        guardData[currGuardId] = {};
        guardData[currGuardId].totalSleep = currGuardTotalSleep;
        guardData[currGuardId].sleep = currGuardSleep;
      }

      // Resetta buffern
      currGuardId = "";
      currGuardTotalSleep = 0;
      currGuardSleep = {};
    } else {
      // Buffra
      if (!state.includes("Guard")) {
        const time = findTime(string);
        const nextTime = findTime(array[i + 1]);

        if (state.includes("falls")) {
          // Hantera somna
          const fallAsleep = parseInt(time.slice(3), 10);
          const wakeUp = parseInt(nextTime.slice(3), 10);
          const minutesAsleep = wakeUp - fallAsleep;

          currGuardTotalSleep = currGuardTotalSleep + minutesAsleep;

          for (let i = 0; i < minutesAsleep; i++) {
            // Iterera en gång för varje minut som vakten sover
            const dynamicNumber = fallAsleep + i;
            const length = (Math.log(dynamicNumber) * Math.LOG10E + 1) | 0;
            const timeStamp =
              length === 1 ? `00:0${fallAsleep + i}` : `00:${fallAsleep + i}`;

            currGuardSleep[timeStamp] = currGuardSleep[timeStamp]
              ? currGuardSleep[timeStamp] + 1
              : 1;
          }
        }
      } else {
        // Buffra ett nytt vakt-ID
        currGuardId = findGuardId(string);
      }
    }
  });

  const sleepiestGuardId = parseInt(
    Object.keys(guardData)
      .map(id => {
        return [guardData[id].totalSleep, id];
      })
      .sort()
      .reverse()[0][1]
  );

  const sleepiestGuardSleepSchedule = guardData[sleepiestGuardId].sleep;
  const sleepiestMinute = parseInt(
    Object.keys(sleepiestGuardSleepSchedule)
      .map(timeStamp => {
        return [sleepiestGuardSleepSchedule[timeStamp], timeStamp];
      })
      .sort((a, b) => a[0] - b[0])
      .reverse()[0][1]
      .slice(3)
  );

  console.log("CORRECT ANSWER:", sleepiestGuardId * sleepiestMinute);
};
