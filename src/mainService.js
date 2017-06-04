/************************************************
/ External Modules
/***********************************************/
import EventEmitter from "events";

/************************************************
/ Custom Modules
/***********************************************/
import APIServer from "./interface/APIServer.js";
import confManager from "./manager/confManager";
import userManager from "./manager/userManager";
import logManager from "./manager/logManager";

//Set logger
const log = logManager.getLogger("MainService");

/************************************************
/ MainService
/***********************************************/
class MainService extends EventEmitter {

    constructor(){
      super();

      this.event = {
        LOAD_CONFIG_DONE: "LOAD_CONFIG_DONE",
        INIT_MANAGERS_DONE: "INIT_MANAGERS_DONE",
        INIT_INTERFACES_DONE: "INIT_INTERFACES_DONE"
      };

      this.interfaces = [new APIServer()];
      this.managers = [userManager];
    }

    emitEvent(){
      log.debug(`< ${arguments[0]} >`);
      this.emit(...arguments);
    }

    init(){

      log.func("init()");

      this.registerEventListener();
      confManager.load("./configure.json");
    }

    registerEventListener(){

      this.on(this.event.LOAD_CONFIG_DONE, () => {
        this.initManagers();
      });

      this.on(this.event.INIT_MANAGERS_DONE, () => {
        this.initInterfaces();
      });

      this.on(this.event.INIT_INTERFACES_DONE, () => {
        this.interfaces[0].startServer();
      });
    }

    initInterfaces(){

      log.func("initInterfaces()");

      this.interfaces.forEach((value) => {
        value.init();
      });

      this.emitEvent(this.event.INIT_INTERFACES_DONE);
    }

    initManagers(){

      log.func("initManagers()");

      this.managers.forEach((value) => {
        value.init();
      });

      this.emitEvent(this.event.INIT_MANAGERS_DONE);
    }
}

//Singleton
const mainService = new MainService();

module.exports = mainService;
