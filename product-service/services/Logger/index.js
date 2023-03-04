import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info",
  format: format.json(),
  defaultMeta: { service: "Book Shop" },
  transports: [
    new transports.Console({
      format: format.simple(),
    }),
  ],
});

export { logger };
