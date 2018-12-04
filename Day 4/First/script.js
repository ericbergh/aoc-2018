const fakeData = [
  "[1518-11-17 00:02] Guard #19 begins shift",
  "[1518-10-26 00:27] falls asleep",
  "[1518-05-02 00:54] wakes up",
  "[1518-09-20 00:24] wakes up",
  "[1518-03-17 00:21] falls asleep",
  "[1518-09-10 00:36] falls asleep",
  "[1518-10-17 00:09] falls asleep",
  "[1518-06-05 00:57] wakes up",
  "[1518-11-17 00:02] Guard #1999 begins shift",
  "[1518-10-26 00:27] falls asleep",
  "[1518-05-02 00:54] wakes up",
  "[1518-09-20 00:24] wakes up",
  "[1518-03-17 00:21] falls asleep",
  "[1518-09-10 00:36] falls asleep",
  "[1518-10-17 00:09] falls asleep",
  "[1518-06-05 00:57] wakes up"
];

let guardData = {
  122: {
    "00:02": 1
  }
};

let currentGuard = {
  id: null
};

window.onload = async () => {
  const data = await fetch("./data.txt")
    .then(response => response.text())
    .then(text => text.split("\n").sort());

  const findGuardId = string => string.match(/#(\d+)\s/)[1];
  const findTime = string => string.match(/\[(.*?)\]/)[1].split(" ")[1];
  const findState = string => string.match(/\](.*)/)[1].trim();

  fakeData.forEach((string, i) => {
    // Jag behöver veta:
    // [x] Vakt-id
    // [] Vilka minuter som vakten sover
    // [] Hur många gånger den sovit på den minuten

    const state = findState(string);

    if (!state.includes("Guard")) {
      const time = findTime(string);
      console.log(time);

      if (state.includes("falls")) {
        // Hantera somna
      } else {
        // Hantera vakna
      }
      // Hantera sova och vakna
    } else {
      // Buffra ett nytt vakt-ID
      const guardId = findGuardId(string);
      currentGuard.id = guardId;
    }

    console.log(string);
    console.log(fakeData[i + 1]);

    if (fakeData[i + 1] && fakeData[i + 1].includes("Guard")) {
      console.log("NEW GUARD INC!");
      // New guard on next iteration
      // Använd vår buffer för att skapa nya object

      if (guardData[currentGuard.id]) {
        // Vakten finns redan i objektet
      } else {
        // Ny vakt
        guardData[currentGuard.id] = {};
      }

      currentGuard = {}; // Reset the buffer
    } else {
      // Out of guards
      console.log("OUT OF GUARDS");
    }
  });
};

// if (string.includes("Guard")) {
//   // Jag behöver veta:
//   // Vakt-id
//   // Vilka minuter som vakten sover
//   // Hur många gånger den sovit på den minuten
//   const guardId = string.match(findGuardId)[1];
//   const time = string.match(findTime)[1].split(" ")[1];
//   const state = string.match(findState);
//   console.log(state);

//   console.log(time);
//   if (guardData[guardId]) {
//     // Hej
//   } else {
//     guardData[guardId] = {};
//   }
// }
