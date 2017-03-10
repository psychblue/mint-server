import logger from "./logger";

class LogManager {

  constructor(label){
    this.label = "[" + label + "]\t";
    this.logger = logger.getLogger();
    this.logger.info("LogManager for " + label + " is set...");
  }

  func(log){
    this.logger.info(this.label + ">> ENTER: " + log);
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

export default LogManager;
