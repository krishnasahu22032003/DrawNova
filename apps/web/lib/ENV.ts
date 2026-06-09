import "dotenv/config" ; 

const ENV_SECRETS = {

BASE_BACKEND_URL:process.env.NEXT_PUBLIC_BASE_BACKEND_URL,
WS_URL:process.env.NEXT_PUBLIC_BASE_WS_URL

} ;

export default ENV_SECRETS ; 