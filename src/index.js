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
router.get("/*", (req, res) => {
  res.render("index");
});

router.post("/login",
  routingFuncFactory.user.doLocalLogin()
);

export default router;
