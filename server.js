const app = require("./app");

const PORT = 3001

const server = app.listen(3001, () => {
    console.log(`Listening on port: ${PORT}`);
});

// process.on("SIGINT", () => {
//     server.close(() => console.log("Exit server"));
// });
