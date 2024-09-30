import * as contentfulManager from "contentful-management";
import yargs from "yargs";
import * as chalk from "chalk";
import contentfulClient from "contentful";
import { cloneModel } from "./service/model";
import { cloneContent } from "./service/content";
import { cloneAssets } from "./service/assets";
interface Args {
  "from-space-id": string;
  "from-space-api-key": string;
  "to-space-id": string;
  "to-space-api-key": string;
  "with-content"?: boolean;
}

// Parse command line arguments
const argv = yargs
  .option("from-space-id", {
    type: "string",
    demandOption: true,
    describe: "ID of the source space",
  })
  .option("from-space-api-key", {
    type: "string",
    demandOption: true,
    describe: "API key for the source space",
  })
  .option("to-space-id", {
    type: "string",
    demandOption: true,
    describe: "ID of the target space",
  })
  .option("to-space-api-key", {
    type: "string",
    demandOption: true,
    describe: "API key for the target space",
  })
  .option("with-content", {
    type: "boolean",
    describe: "Whether to copy content as well",
  })
  .help().argv as Args;

const cloneSpace = async () => {
  try {
    const toClient = contentfulManager.createClient({
      accessToken: argv["to-space-api-key"],
    });

    const fromClient = contentfulClient.createClient({
      space: argv["from-space-id"],
      accessToken: argv["from-space-api-key"],
    });

    const toSpace = await (
      await toClient.getSpace(argv["to-space-id"])
    ).getEnvironment("master");

    console.log("Successfully authenticated both spaces!");
    await cloneModel(fromClient, toSpace);
    await cloneAssets(fromClient, toSpace);
    await cloneContent(fromClient, toSpace);
  } catch (error: any) {
    console.error("Error during cloning process: ", error.message);
    if (error.name === "RateLimitError") {
      console.log("Rate limit reached. Try again after some time.");
    }
  }
};

// Validate inputs
const validateInput = () => {
  if (!argv["from-space-api-key"] || !argv["to-space-api-key"]) {
    throw new Error("Invalid API key format.");
  }
  // Additional validation logic for space names, etc.
};

try {
  validateInput();
  cloneSpace();
} catch (error: any) {
  console.error("Input validation error: ", error.message);
}
