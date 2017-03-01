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
import loggerFactory from "./lib/logger/logger";
import routes from "./index";

const confParams = JSON.parse(fs.readFileSync("./configure.json"));
let logger = loggerFactory("Main");

/************************************************
/ Cluster Setting
/***********************************************/
cluster.schedulingPolicy = cluster.SCHED_RR;

if(cluster.isMaster){

  cluster.fork();

  cluster.on("online", (worker) => {
    logger.info("Worker is online: pid: " + worker.process.pid);
  });

  cluster.on("exit", (worker, code, signal) => {
    logger.info("Worker is dead: pid: " + worker.process.pid + ", code: " + code + ", signal: " + signal);
    cluster.fork();
  });

}
else{

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
  //app.use(passport.initialize());
  //app.use(passport.session());
  app.use("/", routes);

  /************************************************
  / HTTP Server
  /***********************************************/
  const httpServer = app.listen(confParams.http_server.port, () => {
    logger.info("=============== MINT ==============");
    logger.info("Listening on port %d", httpServer.address().port);
  });

}
