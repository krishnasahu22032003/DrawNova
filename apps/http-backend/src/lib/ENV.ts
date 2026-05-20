import "dotenv/config" ; 

const ENV_SECRETS = {

PORT:process.env.PORT , 
JWT_SECRET:process.env.JWT_SECRET,
NODE_ENV:process.env.NODE_ENV

}

export default ENV_SECRETS ; 