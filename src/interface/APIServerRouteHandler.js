/************************************************
/ External Modules
/***********************************************/
import express from "express";

/************************************************
/ Custom Modules
/***********************************************/
import userManager from "../manager/userManager";
import logManager from "../manager/logManager";

const log = logManager.getLogger("APIServerRouteHandler");

/************************************************
/ APIServerRouteHandler
/***********************************************/
class APIServerRouteHandler {

  constructor(){

    this.router = express.Router();
  }

  init(){

    log.func("init()");

    this.setMiddleware();
    this.setRoute();
  }

  getRouter(){

    log.func("getRouter()");

    return this.router;
  }

  setMiddleware(){

    log.func("setMiddleware()");

    this.router.use(
      userManager.checkLogin,
      (req, res, next) => {
        if(res.reply.result){
          next();
        }
        else{
          if(req.xhr){
            log.debug(`(${req.id}) Unauthorized AJAX request`);

            this.sendResponse(req, res);
          }
          else{
            log.debug(`(${req.id}) Unauthorized Normal HTTP request`);
            res.redirect("/login");
          }
        }
      }
    );
  }

  setRoute(){

    log.func("setRoute()");

    this.router.get("/*",
      (req, res) => {
        res.render("index");
      }
    );

    this.router.post("/login",
      userManager.doLocalLogin
    );
  }

  sendResponse(req, res){

    log.func("sendResponse()", req.id);
    log.info(`(${req.id}) RESPONSE: ${JSON.stringify(res.reply)}`);

    try{
      res.json(res.reply);
    }
    catch(error){
      log.error(error.stack);
      res.json({
        "result": false,
        "code": 500,
        "text": "Server Error"
      });
    }
  }
}

const apiServerRouteHandler = new APIServerRouteHandler();

export default apiServerRouteHandler;
