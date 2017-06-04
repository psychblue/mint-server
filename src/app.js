/************************************************
/ NPM Modules
/***********************************************/
import cluster from "cluster";
import os from "os";

/************************************************
/ Custom Modules
/***********************************************/
import logManager from "./manager/logManager";

//Set logger
const log = logManager.getLogger("App");

/************************************************
/ Cluster Master Setting
/***********************************************/
if(cluster.isMaster){

  log.info("=============== MINT ==============");

  cluster.schedulingPolicy = cluster.SCHED_RR;
  //for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  //}

  cluster.on("online", (worker) => {
    log.info(`Worker is online: pid: ${worker.process.pid}`);
  });

  cluster.on("exit", (worker, code, signal) => {
    log.info(`Worker is dead: pid: ${worker.process.pid}, code: ${code}, signal: ${signal}`);

    if(code !== 0){
      cluster.fork();
    }
  });

}
else{

  const service = require("./mainService");
  service.init();
}
