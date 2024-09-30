import { ContentfulClientApi } from "contentful";
import { Environment } from "contentful-management";

const mapContentTypeFields = (fields: any[]): any[] => {
  return fields.map((field) => {
    // Map validations
    const newValidations = field?.validations?.map((validation: any) => {
      // Convert { pattern: string } to RegExp if necessary
      if (validation?.regexp && validation?.regexp?.pattern) {
        return {
          ...validation,
          regexp: new RegExp(validation.regexp.pattern), // Convert to RegExp object
        };
      }
      return validation;
    });

    return {
      ...field,
      validations: newValidations,
    };
  });
};

export const cloneModel = async (
  fromClient: ContentfulClientApi<undefined>,
  toSpaceManager: Environment
) => {
  //  Copy models
  const contentTypes = await fromClient.getContentTypes();
  for (const contentType of contentTypes.items) {
    try {
      const mappedFields = mapContentTypeFields(contentType.fields);

      await toSpaceManager
        .createContentTypeWithId(contentType.sys.id, {
          ...contentType,
          fields: mappedFields,
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
