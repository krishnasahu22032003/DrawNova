
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT;

if (!JWT_SECRET) throw new Error("JWT_SECRET is not set");
if (!PORT) throw new Error("PORT is not set");

const ENV = {
  PORT,
  JWT_SECRET,
};

export default ENV;