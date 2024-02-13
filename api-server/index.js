const express = require("express");
const { generateSlug } = require("random-word-slugs");
const { spawn } = require("child_process");
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

const PORT = 8000;
const containerImage = process.env.containerimg;
const cstring = process.env.cstring;


app.use(express.json());
app.use(cors())

app.post("/api/project", async (req, res) => {

  const { gitURL, slug } = req.body;
  const projectSlug = slug ? slug : generateSlug();

  const dockerRunCommand = `docker run -d --rm --name ${projectSlug} -e repoUrl=${gitURL} -e projectid=${projectSlug} -e cstring="${cstring}" ${containerImage}`;
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
    data: { projectSlug, url: `http://${projectSlug}.localhost:${PORT}` },
  });
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});