/************************************************
/ Custom Modules
/***********************************************/
import loggerFactory from "../lib/logger/logger";
import loginManager from "../lib/user/loginManager";

const logger = loggerFactory("Router/user");

export const checkLogin = (req, res, next) => {

  if(req.isAuthenticated()){
    next();
  }
  else{
    res.json({
      "result": "false",
      "code": "401",
      "text": "Unauthorized"
    });
  }
};

export const doLocalLogin = (req, res, next) => {

  loginManager.passport.authenticate("local", (error, user, info) => {

    if(error){
      res.json({
        "result": "false",
        "code": "500",
        "text": "Unknown error"
      });
    }

    if(!user){
      res.json({
        "result": "false",
        "code": "403",
        "text": "Check ID or password"
      })
    }
    else{
      req.logIn(user, (error) => {
        if(error){
          res.json({
            "result": "false",
            "code": "500",
            "text": "Unknown error"
          });
        }
        else{
          res.json({
            "result": "true",
            "code": "200"
          });
        }
      });
    }
  })(req, res, next);

};
