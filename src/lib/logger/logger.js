/************************************************
/ NPM Modules
/***********************************************/
import winston from "winston";
import moment from "moment";

/************************************************
/ Variables
/***********************************************/
const container = new winston.Container();

/************************************************
/ Local Functions
/***********************************************/
const padStr = (i) => (i < 10) ? "0" + i : "" + i;

const getFormattedDate = () => {
	let temp = new Date();
	const dateStr = "_"
									+ padStr(temp.getFullYear())
									+ padStr(1 + temp.getMonth())
									+ padStr(temp.getDate())
									+ "_"
									+ padStr(temp.getHours())
									+ padStr(temp.getMinutes())
									+ padStr(temp.getSeconds());
	return dateStr;
}

/************************************************
/ Module APIs
/***********************************************/
const logger = (name) => {

	const label = name;

	container.add(label, {
		transports: [
			new winston.transports.File({
				level: "debug",
				filename: "main.log",
				maxsize: 1000000,
				maxFiles: 10,
				colorize: true,
				rotationFormat: () => getFormattedDate(),
				json: false,
				timestamp: () => moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
				formatter: (options) => "(" + process.pid + ")\t" + options.timestamp()	+ " ["
																+ options.level.toUpperCase()
																+ "]\t["
																+ label
																+ "]  "
																+ options.message

			})
		]
	});
	const logger = container.get(label);

	logger.func = (funcName) => {
		logger.info(">> ENTER: " + funcName);
	};

	logger.info("Logger for %s is set... ", label);

	return logger;
};

export default logger;
