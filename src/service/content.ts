import { ContentfulClientApi } from "contentful";
import { Environment } from "contentful-management";

// Function to remove disallowed properties from fields and handle nested structures
const cleanField = (field: any): any => {
  if (Array.isArray(field)) {
    return field.map(cleanField);
  } else if (typeof field === "object" && field !== null) {
    const cleanedField = { ...field };
    if (cleanedField.sys) {
      // Handle linked entries and assets
      return {
        sys: {
          id: cleanedField.sys.id,
          linkType: cleanedField.sys.linkType || cleanedField.sys.type,
          type: "Link",
        },
      };
    } else {
      // Recursively clean nested objects
      Object.keys(cleanedField).forEach((key) => {
        cleanedField[key] = cleanField(cleanedField[key]);
      });
      return cleanedField;
    }
  }
  return field;
};

export const cloneContent = async (
  fromClient: ContentfulClientApi<undefined>,
  toSpaceManager: Environment
) => {
  console.log("Copying content...");

  // Copy Entries
  const entries = await fromClient.getEntries();
  for (const entry of entries.items) {
    try {
      // Prepare the fields object with locale
      const fieldsWithLocale = Object.keys(entry.fields).reduce((acc, key) => {
        acc[key] = {
          "en-US": cleanField(entry.fields[key]),
        };
        return acc;
      }, {} as { [key: string]: any });

      // Create entry in the target space
      await toSpaceManager.createEntryWithId(
        entry.sys.contentType.sys.id,
        entry.sys.id,
        {
          fields: fieldsWithLocale,
        }
      );
      console.log(`Copied entry with ID: ${entry.sys.id}`);
    } catch (error: any) {
      console.error(`Error copying entry ${entry.sys.id}: ${error.message}`);
    }
  }
  await publishContent(toSpaceManager);
};

const publishContent = async (toSpaceManager: Environment) => {
  console.log("Publishing content...");

  // Fetch all entries from the target space
  const entries = await toSpaceManager.getEntries();
  for (const entry of entries.items) {
    try {
      // Publish each entry
      await toSpaceManager.getEntry(entry.sys.id).then((entryToPublish) => {
        return entryToPublish.publish();
      });
      console.log(`Published entry with ID: ${entry.sys.id}`);
    } catch (error: any) {
      console.error(`Error publishing entry ${entry.sys.id}: ${error.message}`);
    }
  }
};
