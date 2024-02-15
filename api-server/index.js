const express = require("express");
const { generateSlug } = require("random-word-slugs");
const { spawn } = require("child_process");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

const PORT = 8000;
const containerImage = process.env.containerimg;
const cstring = process.env.cstring;

app.use(express.json());
app.use(
  cors({
    origin: "https://deployfor.me/",
  })
);

const validate = (url, domain) => {
  if (!url || !domain) {
    toast.error("Please fill in the fields");
    return false;
  }
  if (domain.includes(" ") || url.includes(" ")) {
    toast.error("Domain cannot contain spaces or dot");
    return false;
  }
  if (!url.startsWith("https://github.com")) {
    toast.error("URL must start with https://github.com");
    return false;
  }
  return true;
};

app.post("/api/project", async (req, res) => {
  let { gitURL, slug } = req.body;
  let projectSlug = slug ? slug : generateSlug();

  gitURL = gitURL.trim().toLowerCase();
  slug = slug.trim().toLowerCase();

  if (!validate(gitURL, slug)) {
    return res.status(400).json({
      status: "invalid",
      data: "Invalid input",
    });
  }

  const dockerRunCommand = `docker run --rm --name ${projectSlug} -e repoUrl=${gitURL} -e projectid=${projectSlug} -e cstring="${cstring}" ${containerImage}`;
  console.log(dockerRunCommand);
  const dockerProcess = spawn("sh", ["-c", dockerRunCommand], {
    stdio: "pipe",
  });

  dockerProcess.stdout.pipe(process.stdout);
  dockerProcess.stderr.pipe(process.stderr);

  dockerProcess.on("exit", (code, signal) => {
    console.log(`Child process exited with code ${code} and signal ${signal}`);
  });
  return res.json({
    status: "queued",
    data: { projectSlug, url: `http://${projectSlug}.deployfor.me` },
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
