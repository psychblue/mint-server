/************************************************
/ NPM Modules
/***********************************************/
import express from "express";

/************************************************
/ Custom Modules
/***********************************************/
import LogManager from "./lib/logger/LogManager";
import routingFuncFactory from "./route/routingFuncFactory";

/************************************************
/ Variables
/***********************************************/
const router = express.Router();
const log = new LogManager("Router");

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
