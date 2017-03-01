/************************************************
/ NPM Modules
/***********************************************/
import passport from "passport";
import { Strategy } from "passport-local";

/************************************************
/ Custom Modules
/***********************************************/
import loggerFactory from "../logger/logger";

const logger = loggerFactory("loginManager");

//Passport Setting
class LoginManager {

  constructor(){

    this.passport = passport;

    //Passport Setting
    let localStrategy = new Strategy((username, password, done) => {

      if(true){
        return done(null, user);
      }
      else{
        return done(null, false);
      }
    });

    this.passport.use(localStrategy);

    this.passport.serializeUser((user, done) => {
      done(null, user);
    });

    this.passport.deserializeUser((user, done) => {
      done(null, user);
    });

    logger.info("Passport is set...");
  }

}

const loginManager = new LoginManager();

export default loginManager;
