const app = require("./disc/app");
const config = require("./disc/configs/variable.configs");

const PORT = config.SERVER.port;
const HOST = config.SERVER.host;

app.listen(PORT, HOST, (err) => {
   if (!err) console.log(1, `Welcome to main server  ${HOST}:${PORT}`);
   else console.log("Get out", err);
});
