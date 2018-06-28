var env_file = ".env";
if(process.env.NODE_ENV == "prod") {
    env_file = ".env.prod"
}
require('dotenv').config({path: env_file})
