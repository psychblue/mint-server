/************************************************
/ External Modules
/***********************************************/
import passport from "passport";
import { Strategy } from "passport-local";

/************************************************
/ Custom Modules
/***********************************************/
import logManager from "./logManager";

const log = logManager.getLogger("UserManager");

/************************************************
/ UserManager
/***********************************************/
class UserManager {

  constructor(){

    this.whitePath = [
      "/",
      "/login"
    ];

    this.passport = passport;
  }

  init(){

    log.func("init()");

    this.initPassport();
  }

  initPassport(){

    log.func("initPassport()");

    const localStrategy = new Strategy((username, password, done) => {

      if(true){
        var user = {"username": username};
        return done(null, user);
      }
      else{
        return done(null, false);
      }
    });

    this.passport.use(localStrategy);

    this.passport.serializeUser((user, done) => {
      log.info(`${user.username} is logged in`);
      done(null, user);
    });

    this.passport.deserializeUser((user, done) => {
      log.info(`${user.username} is logged out`);
      done(null, user);
    });

    log.info("Passport is set...");
  }

  getPassport(){

    log.func("getPassport()");

    return this.passport;
  }

  checkWhitePath(path){

    log.func("checkWhitePath()");

    if(this.whitePath.find((element) => element === path) !== undefined){
      log.debug("whitePath: true");
      return true;
    }
    else{
      log.debug("WhitePath: false");
      return false;
    }
  }

  /************************************************
  / Event Handling Functions
  /***********************************************/

  checkLogin = (req, res, next) => {

    req.id = Math.floor(Math.random() * (1000000 - 100000)) + 999999;

    log.func("checkLogin()", req.id);
    log.info(`(${req.id}) REQUEST: ${JSON.stringify(req.body)}`);

    if(req.isAuthenticated() || this.checkWhitePath(req.path)){
      res.reply = {
        "result": true,
        "code": 202
      };
    }
    else{
      log.debug(`(${req.id}) User is unauthorized`);
      res.reply = {
        "result": false,
        "code": 401,
        "text": "Unauthorized"
      };
    }

    next();
  }

  doLocalLogin = (req, res, next) => {

    log.func("doLocalLogin()", req.id);

    this.passport.authenticate("local", (error, user, info) => {

      if(error){
        log.error(`(${req.id}) ${error.stack}`);
        res.reply = {
          "result": false,
          "code": 500,
          "text": "Server Error"
        };

        next("route");
      }

      if(!user){
        res.reply = {
          "result": false,
          "code": 403,
          "text": "Check ID or password"
        };

        next("route");
      }
      else{
        req.logIn(user, (error) => {
          if(error){
            log.error(`(${req.id}) ${error.stack}`);
            res.reply = {
              "result": false,
              "code": 500,
              "text": "Server Error"
            };

            next("route");
          }
          else{
            res.reply = {
              "result": true,
              "code": 200
            };

            next();
          }
        });
      }
    })(req, res, next);
  }
}

const userManager = new UserManager();

export default userManager;
