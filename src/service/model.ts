import { Environment } from "contentful-management";

export const cloneModel = async (
  fromClient: Environment,
  toSpaceManager: Environment
) => {
  //  Copy models
  const contentTypes = await fromClient.getContentTypes();
  for (const contentType of contentTypes.items) {
    try {
      await toSpaceManager
        .createContentTypeWithId(contentType.sys.id, {
          ...contentType,
          fields: contentType.fields,
        })
        .then((c) => c.publish());
      console.log(`Copied model: ${contentType.name}`);
    } catch (error: any) {
      console.error(
        `Error copying model ${contentType.name}: ${error.message}`
      );
    }
  }
};
