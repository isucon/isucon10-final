"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app");
process.on("unhandledRejection", (e) => {
    console.error(e);
    process.exit(1);
});
process.on("uncaughtExcection", (e) => {
    console.error(e);
    process.exit(1);
});
app_1.app.listen(process.env.PORT ?? 9292, () => {
    console.log("Listening on 9292");
});
