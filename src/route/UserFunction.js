/************************************************
/ Custom Modules
/***********************************************/
import LogManager from "../lib/logger/LogManager";
import loginManager from "../lib/user/loginManager";

class UserFunction {

  constructor(){
    this.log = new LogManager("UserFunction");
  }

  checkLogin() {

    return (req, res, next) => {

      this.log.func("checkLogin()");

      if(req.isAuthenticated() || loginManager.checkWhitePath(req.path)){
        next();
      }
      else{
        if(req.xhr){
          res.json({
            "result": false,
            "code": 401,
            "text": "Unauthorized"
          });
        }
        else{
          res.json({
            "result": false,
            "code": 401,
            "text": "Unauthorized Page"
          });
        }
      }
    }

  }

  addUserDataContainer() {

    return (req, res, next) => {

      this.log.func("addUserDataContainer()");

      if(req.user !== undefined){
        this.log.debug("User request is on [ " + req.path + " ] by [ " + req.user.username + " ]");
      }
      else{
        this.log.debug("User request is on [ " + req.path + " ] by [ Anonymous ]");
      }

      req.container = {};

      next();
    }

  }

  doLocalLogin() {

    return (req, res, next) => {

      this.log.func("doLocalLogin()");

      loginManager.passport.authenticate("local", (error, user, info) => {

        if(error){
          res.json({
            "result": false,
            "code": 500,
            "text": error.toString()
          });
          return;
        }

        if(!user){
          json({
            "result": false,
            "code": 403,
            "text": "Check ID or password"
          })
        }
        else{
          req.logIn(user, (error) => {
            if(error){
              res.json({
                "result": false,
                "code": 500,
                "text": "Unknown error"
              });
            }
            else{
              res.json({
                "result": true,
                "code": 200
              });
            }
          });
        }
      })(req, res, next);

    }

  }

}

const userFunction = new UserFunction();

export default userFunction;
