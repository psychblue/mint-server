/************************************************
/ Custom Modules
/***********************************************/
import LogManager from "../lib/logger/LogManager";
import loginManager from "../lib/user/loginManager";

class UserFunction {

  constructor(){
    this.log = new LogManager("UserFunction");
    this.log.info("UserFunction is set...");
  }

  checkLogin() {

    return (req, res, next) => {

      this.log.func("checkLogin()");

      if(req.isAuthenticated() || loginManager.checkWhitePath(req.path)){
        next();
      }
      else{
        if(req.xhr){
          this.log.debug("Unauthorized AJAX request");
          res.json({
            "result": false,
            "code": 401,
            "text": "Unauthorized"
          });
        }
        else{
          this.log.debug("Unauthorized Normal HTTP request");
          res.redirect("/login");
        }
      }
    }

  }

  addUserDataContainer() {

    return (req, res, next) => {

      this.log.func("addUserDataContainer()");

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
