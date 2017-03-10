/************************************************
/ Custom Modules
/***********************************************/
import LogManager from "../lib/logger/LogManager";
import userFunction from "./userFunction";

class RoutingFuncFactory {

  constructor(){
    this.log = new LogManager("RoutingFuncFactory");
    this.user = userFunction;
  }

}

const routingFuncFactory = new RoutingFuncFactory();

export default routingFuncFactory;
