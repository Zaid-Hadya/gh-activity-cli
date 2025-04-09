const https = require("https");

const username = process.argv[2];

if (!username) {
  console.log("Please provide a GitHub username.");
  process.exit(1);
}

const url = `https://api.github.com/users/${username}/events`;

const options = {
  headers: {
    "User-Agent": "node.js",
  },
};

https.get(url, options, (res) => {
  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res
    .on("end", () => {
      if (res.statusCode === 200) {
        const events = JSON.parse(data);
        console.log(`Featching the GitHub user activites for: ${username}`);
        events.slice(0, 5).forEach((event) => {
          const type = event.type;
          const repo = event.repo.name;
          if (type === "PushEvent") {
            const commitsNum = event.payload.commits.length;
            console.log(`Pushed ${commitsNum} commits to ${repo} `);
          } else if (type === "WatchEvent") {
            console.log(`Opened a new issue in ${repo} `);
          } else if (type === "StarrdEvent") {
            console.log(`Starred ${repo} `);
          } else {
            console.log(`${type} in ${repo}`);
          }
        });
      } else if (res.statusCode === 404) {
        console.log("User not found. Please check the username.");
      } else {
        console.log(`Error: ${res.statusCode}`);
      }
    })
    .on("error", (err) => {
      console.error("Request failed:", err.message);
    });
});
