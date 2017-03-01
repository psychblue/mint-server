import loggerFactory from "../lib/logger/logger";

const logger = loggerFactory("user.js");

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
