// index.js

require("newrelic"); // Must be the FIRST import
const express=require("express");
const app = express();


app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});


app.get("/compute", (req, res) => {
  let count = 0;
  for (let i = 0; i < 1e7; i++) {
    count += i;
  }
  res.json({ result: count });
});


app.get("/delay", async (req, res) => {
  
  await new Promise(resolve => setTimeout(resolve, 6*1000));
  res.json({ delayed: `6000 ms` });
});


app.get("/error", (req, res) => {
  throw new Error("Simulated error for APM tracking");
});


app.get("/external", async (req, res) => {

  await new Promise(resolve => setTimeout(resolve, 200));
  res.json({ data: "Simulated external API response" });
});


app.get("/", (req, res) => {
  console.log("Root hit");
  res.json({ message: "Hello, World!" });
});


app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
