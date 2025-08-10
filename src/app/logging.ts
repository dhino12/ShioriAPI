import * as winston from "winston";

export const logger = winston.createLogger({
    level: "debug", // warn
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({})
    ]
});