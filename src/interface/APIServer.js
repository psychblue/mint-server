/************************************************
/ External Modules
/***********************************************/
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";

/************************************************
/ Custom Modules
/***********************************************/
import confManager from "../manager/confManager";
import userManager from "../manager/userManager";
import APIServerRouteHandler from "./APIServerRouteHandler";
import logManager from "../manager/logManager"

const log = logManager.getLogger("APIServer");

/************************************************
/ APIServer
/***********************************************/
class APIServer {

  constructor(){

    this.interface = express();
  }

  init(){

    log.func("init()");

    this.interface.set("view engine", "ejs");
    this.interface.set("views", confManager.config.express.viewPath);

    this.interface.use(express.static(confManager.config.express.staticPath));
    this.interface.use(bodyParser.json());
    this.interface.use(bodyParser.urlencoded({extended: "true"}));
    this.interface.use(session(confManager.config.express_session));
    this.interface.use(userManager.getPassport().initialize());
    this.interface.use(userManager.getPassport().session());
    this.interface.use((req, res, next) => {
      if(req.user !== undefined){
        log.info(`User request is on [ ${req.path} ] by [ ${req.user.username} ]`);
      }
      else{
        log.info(`User request is on [ ${req.path} ] by [ Anonymous ]`);
      }
      next();
    });

    APIServerRouteHandler.init();
    this.interface.use("/", APIServerRouteHandler.getRouter());

    this.interface.use((req, res) => {
      if(res.reply.code === 202){
        log.error(`Route ${req.path} is not found.`);
        res.reply = {
          "result": false,
          "code": 404,
          "text": "Not Found"
        };
      }
      APIServerRouteHandler.sendResponse(req, res);
    });

    this.interface.use((err, req, res, next) => {
      log.error(err.stack);
      res.json({
        "result": false,
        "code": 500,
        "text": "Server Error"
      });
    });
  }

  startServer(){

    log.func("startServer()");

    const httpServer = this.interface.listen(confManager.config.http_server.port, () => {
      log.info(`API Server is listening on port ${httpServer.address().port}`);
    });
  }

}

export default APIServer;
