const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const bcrypt = require('bcrypt');
const userService = require('../../../api/components/user/service');
const db = require('../../../store/db');
const boom = require('@hapi/boom');

const UserService = userService(db.users);

passport.use(new BasicStrategy(
    async function (email, password, cb) {
        try {
            const user = await UserService.verifyUser(email);    
            console.log(user);
            if (!user) {
                return cb(boom.unauthorized(), false);
            }
            if (!(await bcrypt.compare(password, user.password))) {             
              return cb(boom.unauthorized(), false);
            }
            delete user.password;   
            return cb(null, user);
        } catch (error) {
            return cb(error)
        }
    }
));