/************************************************
/ External Modules
/***********************************************/
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import moment from "moment";

/************************************************
/ LogEnabler
/***********************************************/
class LogEnabler {

  constructor(label, logger){

    //Properties
    this.label = `[ ${label} ]  `;
    this.logger = logger;

    this.logger.info(`[ LogEnabler ]  Logger for ${label} is enabled...`);
  }

  func(log, id){

    if(id !== undefined){
      this.logger.debug(`${this.label} (${id}) >> ENTER: ${log}`);
    }
    else{
      this.logger.debug(`${this.label} >> ENTER: ${log}`);
    }
  }

  error(log){

    this.logger.error(this.label + log);
  }

  warn(log){

    this.logger.warn(this.label + log);
  }

  info(log){

    this.logger.info(this.label + log);
  }

  verbose(log){

    this.logger.verbose(this.label + log);
  }

  debug(log){

    this.logger.debug(this.label + log);
  }

  silly(log){

    this.logger.silly(this.label + log);
  }
}

/************************************************
/ LogManager
/***********************************************/
class LogManager {

	constructor(name, options){

		const container = new winston.Container();
		if(process.env.NODE_ENV === "development"){
			container.add(name, options.dev);
		}
		else{
			container.add(name, options.prod);
		}

		this.logger = container.get(name);

		this.logger.on("error", (err) => {
			this.logger.error(err.stack);
		})

		this.logger.info(`[ LogManager ]  ${name} logger is set...`);
	}

	getLogger(label){

		return new LogEnabler(label, this.logger);
	}
}

//Singleton
const logManager = new LogManager("main", {
	prod: {
	  transports: [
	    new winston.transports.DailyRotateFile({
	      level: "debug",
	      filename: "main_",
				datePattern: "yyyyMMdd.log",
	      maxsize: 1000000,
	      maxFiles: 5,
	      json: false,
	      //handleExceptions: true,
	      //humanReadableUnhandledException: true,
	      timestamp: () => moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
	      formatter: (options) => "(" + process.pid + ")\t" + options.timestamp()	+ " ["
	                              + options.level.toUpperCase()
	                              + "]\t"
	                              + options.message
	    })
		]
	},
	dev: {
		transports: [
			new winston.transports.Console({
				level: "debug",
				json: false,
				colorize: true,
				timestamp: () => moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
	      formatter: (options) => "(" + process.pid + ")\t" + options.timestamp()	+ " ["
	                              + options.level.toUpperCase()
	                              + "]\t"
	                              + options.message
			})
	  ]
	}
});

export default logManager;
