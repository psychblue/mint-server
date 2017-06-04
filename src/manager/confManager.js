/************************************************
/ External Modules
/***********************************************/
import fs from "fs";

/************************************************
/ Custom Modules
/***********************************************/
import logManager from "./logManager";

//Set logger
const log = logManager.getLogger("ConfManager");

/************************************************
/ ConfManager
/***********************************************/
class ConfManager {

  constructor(){

    this.config = {};
  }

  load(fileName){

    log.func("load()");

    fs.readFile(fileName, (err, data) => {
      if(err){
        log.error("Loading Config file is failed!!!");
        log.error(err);

        process.disconnect();
      }
      else{
        this.config = JSON.parse(data);
        log.info("Config file is loaded successfully...");

        const mainService = require("../mainService");

        mainService.emitEvent(mainService.event.LOAD_CONFIG_DONE);
      }
    });
  }
}

//Singleton
const confManager = new ConfManager();

export default confManager;
