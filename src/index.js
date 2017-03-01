/************************************************
/ NPM Modules
/***********************************************/
import express from "express";

/************************************************
/ Custom Modules
/***********************************************/
import loggerFactory from "./lib/logger/logger";
import * as user from "./route/user";

/************************************************
/ Variables
/***********************************************/
const router = express.Router();
const logger = loggerFactory("Router");

/************************************************
/ Router Middlewares
/***********************************************/
router.use((req, res, next) => {

  if(req.user !== undefined){
    logger.debug("User request is on [ " + req.path + " ] by [ " + req.user.username + " ]");
  }
  else{
    logger.debug("User request is on [ " + req.path + " ] by [ Anonymous ]");
  }

  req.container = {};

  next();
});

/************************************************
/ Routing Rules
/***********************************************/
router.get("/userinfo",
user.checkLogin,
(req, res) => {
  res.json({
    "result": "true",
    "code": "200",
    "data": {
      "name": "psychblue"
    }
  });
});

router.get("/*", (req, res) => {
  res.render("index");
});

// 404 Not Found
router.all("/*", (req, res) => {
  res.json({
    "result": "false",
    "code": "404",
    "text": "Not Found"
  });
});

export default router;
