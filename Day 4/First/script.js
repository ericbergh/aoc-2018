window.onload = async () => {
  const data = await fetch("./data.txt")
    .then(response => response.text())
    .then(text => text.split("\n").sort());

  const findGuardId = /#(\d+)\s/;

  data.forEach(string => {
    if (string.includes("Guard")) {
      // Create new Guard key
      const guardId = string.match(findGuardId)[1];
      console.log(guardId);
    }
  });
};
