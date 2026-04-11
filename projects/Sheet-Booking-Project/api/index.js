"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../src/app");
const connection_1 = require("../src/db/connection");
const app = (0, app_1.createApplication)();
// Entry point middleware to ensure DB connection
app.use(async (req, res, next) => {
    await (0, connection_1.connectDB)();
    next();
});
exports.default = app;
//# sourceMappingURL=index.js.map