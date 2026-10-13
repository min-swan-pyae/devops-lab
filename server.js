const http = require("node:http");

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);

  res.writeHead(200, {
    "Content-Type": "text/plain"
  });

  res.end("Hello from my DevOps lab!\n");
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Server listening on port 3000");
});
