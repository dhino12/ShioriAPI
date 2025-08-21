"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = require("./app/logging");
const router_1 = __importDefault(require("./app/router"));
router_1.default.listen(3000, () => {
    logging_1.logger.info("Listening on port 3000");
});
