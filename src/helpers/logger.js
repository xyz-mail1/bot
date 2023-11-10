const pino = require("pino");

const today = new Date();
const pinoLogger = pino.default(
  {
    level: "debug",
  },
  pino.multistream([
    {
      level: "info",
      stream: pino.transport({
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "yyyy-mm-dd HH:mm:ss",
          ignore: "pid,hostname",
          singleLine: false,
          hideObject: true,
          customColors: "info:blue,warn:yellow,error:red",
        },
      }),
    },
    {
      level: "debug",
      stream: pino.destination({
        dest: `${process.cwd()}/logs/combined-${today.getFullYear()}.${
          today.getMonth() + 1
        }.${today.getDate()}.log`,
        sync: true,
      }),
    },
  ]),
);

module.exports = class Logger {
  static success(content) {
    pinoLogger.info(content);
  }

  static log(content) {
    pinoLogger.info(content);
  }

  static warn(content) {
    pinoLogger.warn(content);
  }

  static error(content, ex) {
    if (ex) {
      pinoLogger.error(ex, `${content}: ${ex?.message}`);
    } else {
      pinoLogger.error(content);
    }
  }

  static debug(content) {
    pinoLogger.debug(content);
  }
};
