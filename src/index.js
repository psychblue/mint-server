/************************************************
/ NPM Modules
/***********************************************/
import express from "express";

/************************************************
/ Custom Modules
/***********************************************/
import logger from "./lib/logger/logger";
import routingFuncFactory from "./route/RoutingFuncFactory";

/************************************************
/ Variables
/***********************************************/
const router = express.Router();
const log = logger("Router");

/************************************************
/ Router Middlewares
/***********************************************/
router.use(routingFuncFactory.user.checkLogin());
router.use(routingFuncFactory.user.addUserDataContainer());

/************************************************
/ Routing Rules
/***********************************************/
router.get("/test", (req, res) => {
  res.render("index");
});

router.get("/*", (req, res) => {
  res.render("index");
});

router.post("/login",
  routingFuncFactory.user.doLocalLogin()
);

// 404 Not Found
router.all("/*", (req, res) => {
  res.json({
    "result": false,
    "code": 404,
    "text": "Not Found"
  });
});

export default router;
