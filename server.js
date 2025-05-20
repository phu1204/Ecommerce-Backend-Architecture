const app = require("./src/app.js");

const PORT = process.env.PORT || 3002

const server = app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});

process.on("SIGINT", () => {
    server.close(() => console.log("Exit server"));
});
 