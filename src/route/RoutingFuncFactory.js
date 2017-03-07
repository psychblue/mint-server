/************************************************
/ Custom Modules
/***********************************************/
import logger from "../lib/logger/logger";
import userFunction from "./UserFunction";

class RoutingFuncFactory {

  constructor(){
    this.log = logger("RoutingFuncFactory");
    this.user = userFunction;
  }

}

const routingFuncFactory = new RoutingFuncFactory();

export default routingFuncFactory;
