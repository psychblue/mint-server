/************************************************
/ NPM Modules
/***********************************************/
import passport from "passport";
import { Strategy } from "passport-local";

/************************************************
/ Custom Modules
/***********************************************/
import logger from "../logger/logger";

//Passport Setting
class LoginManager {

  constructor(){

    this.log = logger("LoginManager");
    this.whitePath = [
      "/",
      "/login"
    ];
    this.passport = passport;

    this.initPassport(this.passport);
  }

  initPassport(passport){
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
      done(null, user);
    });

    passport.deserializeUser((user, done) => {
      done(null, user);
    });

    this.log.info("Passport is set...");
  }

  checkWhitePath(path){
    if(this.whitePath.find((element) => element === path) !== undefined){
      return true;
    }
    else{
      return false;
    }
  }

}

const loginManager = new LoginManager();

export default loginManager;
