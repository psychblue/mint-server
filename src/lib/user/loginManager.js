/************************************************
/ NPM Modules
/***********************************************/
import passport from "passport";
import { Strategy } from "passport-local";

/************************************************
/ Custom Modules
/***********************************************/
import LogManager from "../logger/LogManager";

//Passport Setting
class LoginManager {

  constructor(){

    this.log = new LogManager("LoginManager");
    this.whitePath = [
      "/",
      "/login"
    ];
    this.passport = passport;

    this.initPassport(this.passport);

    this.log.info("LoginManager is set...");
  }

  initPassport(passport){

    this.log.func("initPassport()");
    //Passport Setting
    let localStrategy = new Strategy((username, password, done) => {

      if(true){
        var user = {"username": username};
        return done(null, user);
      }
      else{
        return done(null, false);
      }
    });

    passport.use(localStrategy);

    passport.serializeUser((user, done) => {
      this.log.info(user.username + " is logged in");
      done(null, user);
    });

    passport.deserializeUser((user, done) => {
      this.log.info(user.username + " is logged out");
      done(null, user);
    });

    this.log.info("Passport is set...");
  }

  checkWhitePath(path){

    this.log.func("checkWhitePath()");

    if(this.whitePath.find((element) => element === path) !== undefined){
      this.log.debug("true");
      return true;
    }
    else{
      this.log.debug("false");
      return false;
    }
  }

}

const loginManager = new LoginManager();

export default loginManager;
