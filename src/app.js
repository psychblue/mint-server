/************************************************
/ NPM Modules
/***********************************************/
import cluster from "cluster";
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import fs from "fs";

/************************************************
/ Custom Modules
/***********************************************/
import logger from "./lib/logger/logger";
import routes from "./index";
import loginManager from "./lib/user/loginManager";

/************************************************
/ Cluster Master Setting
/***********************************************/
if(cluster.isMaster){

  let log = logger("Master");

  log.info("=============== MINT ==============");

  cluster.schedulingPolicy = cluster.SCHED_RR;
  cluster.fork();

  cluster.on("online", (worker) => {
    log.info("Worker is online: pid: " + worker.process.pid);
  });

  cluster.on("exit", (worker, code, signal) => {
    log.info("Worker is dead: pid: " + worker.process.pid + ", code: " + code + ", signal: " + signal);
    cluster.fork();
  });

}
else{

  let log = logger("Worker");

  const confParams = JSON.parse(fs.readFileSync("./configure.json"));

  /************************************************
  / Express Settings
  /***********************************************/
  const app = express();
  app.set("view engine", "ejs");
  app.set("views", confParams.express.viewPath);

  app.use(express.static(confParams.express.staticPath));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: "true"}));
  app.use(session(confParams.express_session));
  app.use(loginManager.passport.initialize());
  app.use(loginManager.passport.session());
  app.use("/", routes);

  app.use((req, res) => {
    res.json({
      "result": false,
      "code": 404,
      "text": "Not Found"
    });
  });

  app.use((err, req, res, next) => {
    log.error("Error: " + err.stack);
    res.json({
      "result": false,
      "code": 500,
      "text": "Server Error"
    });
  });

  /************************************************
  / HTTP Server
  /***********************************************/
  const httpServer = app.listen(confParams.http_server.port, () => {
    log.info("Listening on port %d", httpServer.address().port);
  });

}
