import * as contentfulManager from "contentful-management";
import yargs from "yargs";
import contentfulClient from "contentful";
import { cloneModel } from "./service/model";
import { cloneContent } from "./service/content";
import { cloneAssets } from "./service/assets";
import { isEmpty } from "lodash";

import {
  TO_CONTENT_SPACE_ID,
  TO_CONTENT_MANAGE_KEY,
  FROM_CONTENT_SPACE_ID,
  FROM_CONTENT_DELIVERY_KEY,
  FROM_CONTENT_MANAGE_KEY,
} from "./config";

interface Args {
  "with-content"?: boolean;
}

// Parse command line arguments
const argv = yargs
  .option("with-content", {
    type: "boolean",
    describe: "Whether to copy content as well",
  })
  .help().argv as Args;

const cloneSpace = async () => {
  try {
    const toClient = contentfulManager.createClient({
      accessToken: TO_CONTENT_MANAGE_KEY,
    });

    const fromManger = contentfulManager.createClient({
      accessToken: FROM_CONTENT_MANAGE_KEY,
    });

    const fromClient = contentfulClient.createClient({
      space: FROM_CONTENT_SPACE_ID,
      accessToken: FROM_CONTENT_DELIVERY_KEY,
    });

    const fromSpace = await (
      await fromManger.getSpace(FROM_CONTENT_SPACE_ID)
    ).getEnvironment("master");

    const toSpace = await (
      await toClient.getSpace(TO_CONTENT_SPACE_ID)
    ).getEnvironment("master");

    console.log("Successfully authenticated both spaces!");
    await cloneModel(fromSpace, toSpace);
    if (argv["with-content"]) {
      await cloneAssets(fromClient, toSpace);
      await cloneContent(fromClient, toSpace);
    }
  } catch (error: any) {
    console.error("Error during cloning process: ", error.message);
    if (error.name === "RateLimitError") {
      console.log("Rate limit reached. Try again after some time.");
    }
  }
};

// Validate inputs
const validateInput = () => {
  if (isEmpty(FROM_CONTENT_SPACE_ID) && isEmpty(TO_CONTENT_SPACE_ID)) {
    throw new Error("Invalid SPACE ID.");
  }
  if (isEmpty(FROM_CONTENT_DELIVERY_KEY) && isEmpty(TO_CONTENT_MANAGE_KEY)) {
    throw new Error("Invalid API key.");
  }
  // Additional validation logic for space names, etc.
};

try {
  validateInput();
  cloneSpace();
} catch (error: any) {
  console.error("Input validation error: ", error.message);
}
