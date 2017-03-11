/************************************************
/ NPM Modules
/***********************************************/
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import moment from "moment";

class Logger {

	constructor(label, options){
		const container = new winston.Container();
		if(process.env.NODE_ENV === "development"){
			container.add(label, options.dev);
		}
		else{
			container.add(label, options.prod);
		}

		this.logger = container.get(label);

		this.logger.on("error", (err) => {
			this.logger.error(err.stack);
		})

		this.logger.info("[Logger]  Logger is set...");
	}

	getLogger(){
		return this.logger;
	}
}

const logger = new Logger("main", {
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
				timestamp: () => moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
	      formatter: (options) => "(" + process.pid + ")\t" + options.timestamp()	+ " ["
	                              + options.level.toUpperCase()
	                              + "]\t"
	                              + options.message
			})
	  ]
	}
});

export default logger;
