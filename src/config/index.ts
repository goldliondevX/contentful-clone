import env from "dotenv";

class Env {
  constructor() {
    env.config();
  }

  get(key: string) {
    return env.parse(key);
  }
}

env.config();

const FROM_CONTENT_SPACE_ID = process.env.FROM_CONTENT_SPACE_ID ?? "";
const FROM_CONTENT_DELIVERY_KEY = process.env.FROM_CONTENT_DELIVERY_KEY ?? "";
const FROM_CONTENT_MANAGE_KEY = process.env.FROM_CONTENT_MANAGE_KEY ?? "";

const TO_CONTENT_SPACE_ID = process.env.TO_CONTENT_SPACE_ID ?? "";
const TO_CONTENT_MANAGE_KEY = process.env.TO_CONTENT_MANAGE_KEY ?? "";

export {
  FROM_CONTENT_SPACE_ID,
  FROM_CONTENT_DELIVERY_KEY,
  TO_CONTENT_SPACE_ID,
  TO_CONTENT_MANAGE_KEY,
  FROM_CONTENT_MANAGE_KEY,
};

export default Env;
