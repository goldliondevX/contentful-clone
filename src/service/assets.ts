import { ContentfulClientApi } from "contentful";
import { Environment } from "contentful-management";

export const cloneAssets = async (
  fromClient: ContentfulClientApi<undefined>,
  toSpaceManager: Environment
) => {
  console.log("Copying Assets...");

  // Copy models
  const assets = await fromClient.getAssets();
  for (const asset of assets.items) {
    try {
      // Get and create the asset file details
      const file = asset.fields.file;

      if (file) {
        const fileDetails = {
          contentType: file.contentType,
          fileName: file.fileName,
          upload: `https:${file.url}`,
        };

        const assetFields = {
          title: { "en-US": asset?.fields?.title ?? "" },
          description: {
            "en-US": asset?.fields?.description ? asset.fields.description : "",
          },
          file: { "en-US": fileDetails },
        };

        // Create asset in the target space
        await toSpaceManager
          .createAssetWithId(asset.sys.id, {
            fields: assetFields,
          })
          .then(async (asset) => await asset.processForAllLocales())
          .then(async (asset) => await asset.publish());

        console.log(`Copied asset with ID: ${asset.sys.id}`);
      }
    } catch (error: any) {
      console.error(`Error copying asset ${asset.sys.id}: ${error.message}`);
    }
  }
};
