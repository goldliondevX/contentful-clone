# Contentful Space Cloning Script

This script clones a Contentful space's models and optionally assets and content from one space to another using the Contentful Management API.

---

## **Features**

- **Model Cloning**: Copies content models from one Contentful space to another.
- **Optional Content and Asset Cloning**: Allows cloning assets and content with the `--with-content` flag or only cloning content with the `--only-content`.
- **Authentication**: Authenticates both source and target spaces using Contentful API keys.
- **Error Handling**: Handles rate limits and input validation errors.

---

## **Types**

- **TO_CONTENT_SPACE_ID**: `string`  
  The space ID of the destination Contentful space.
- **TO_CONTENT_MANAGE_KEY**: `string`  
  The management API key for the target space.

- **FROM_CONTENT_SPACE_ID**: `string`  
  The space ID of the source Contentful space.

- **FROM_CONTENT_DELIVERY_KEY**: `string`  
  The delivery API key for the source space.

- **FROM_CONTENT_MANAGE_KEY**: `string`  
  The management API key for the source space.

- **Args**: `object`
  - `with-content?`: `boolean`  
    An optional flag to clone assets and content as well as models.
  - `only-content?`: `boolean`  
    An optional flag to clone only the content and assets, excluding the models.

---

## **Installation**

1. **Clone or copy the script** to your project directory.
2. **Install dependencies** by running:

   ```bash
   npm install
   ```

3. **Set the required environment** variables in a **.env** file or as shell environment variables:

   ```bash
   TO_CONTENT_SPACE_ID=<Your target space ID>
   TO_CONTENT_MANAGE_KEY=<Your target space management API key (CMA token)>
   FROM_CONTENT_SPACE_ID=<Your source space ID>
   FROM_CONTENT_DELIVERY_KEY=<Your source space delivery API key>
   FROM_CONTENT_MANAGE_KEY=<Your source space management API key>
   ```

### **How to Obtain API Keys and Space IDs**

#### **1. Getting the Space ID**

- **Step 1**: Log into your [Contentful account](https://app.contentful.com/).
- **Step 2**: Navigate to the **Space** you want to work with.
- **Step 3**: You can find the **Space ID** in the **Settings** under [General Settings](https://app.contentful.com/spaces) or in the URL bar after selecting your space:

  Example URL:

  ```
  https://app.contentful.com/spaces/<YOUR_SPACE_ID>
  ```

#### **2. Getting the Content Delivery API Key (CDA)**

- **Step 1**: In your Contentful dashboard, go to **Settings > API keys**.
  You can also access the [API keys page here](https://app.contentful.com/spaces/<YOUR_SPACE_ID>/api/keys).

  Page URL:

  ```
  https://app.contentful.com/spaces/<YOUR_SPACE_ID>/api/keys
  ```

- **Step 2**: Select an existing API key or create a new one by clicking on **Add API Key**.
- **Step 3**: Under **Content Delivery API**, you will find your **Delivery API Key**. Copy it and use it as `FROM_CONTENT_DELIVERY_KEY`.

#### **3. Getting the Content Management API Key (CMA Token)**

- **Step 1**: In the **API keys** section, go to **Settings > CMA TOKENS** in your Contentful dashboard, or visit the [API keys page](https://app.contentful.com/spaces/<YOUR_SPACE_ID>/api/cma_tokens).

  Page URL:

  ```
  https://app.contentful.com/spaces/<YOUR_SPACE_ID>/api/cma_tokens
  ```

- **Step 2**: Click on **Add API Key** to generate a new API key.
- **Step 3**: Use the generated key as your **Content Management API Key** (CMA token) and assign it to `TO_CONTENT_MANAGE_KEY`.

For more details on API keys, refer to the official [Contentful API documentation](https://www.contentful.com/developers/docs/references/content-management-api/).

## **Usage**

Run the script using the following command:

```bash
npm start
```

### **Command Line Options**

- **--with-content**  
  Use this flag to clone assets and content in addition to the models.

- **--only-content**  
  Use this flag to clone only assets and content.

---

## **Examples**

1. **Clone only models**:

   ```bash
   npm start
   ```

2. **Clone models, assets, and content**:

   ```bash
   npm start --with-content
   ```

3. **Only Clone assets, and content**:

   ```bash
   npm start --only-content
   ```

---

## **Error Handling**

- **Rate Limit Error**:  
  If the Contentful API rate limit is reached, the script will stop and display an error message. You will need to retry the operation after the cooldown period.

  Example Error Message:

  ```bash
  Rate limit reached. Try again after some time.
  ```

- **Input Validation**:  
  If required space IDs or API keys are missing, the script will throw an error before execution starts.

  Example Input Validation Error:

  ```bash
  Invalid SPACE ID.
  ```

  ```bash
  Invalid API key.
  ```

---

## **Notes**

- Ensure that the API keys used have sufficient permissions to access and modify the source and target spaces.
- When cloning large spaces, be mindful of Contentful API rate limits, and consider splitting operations or introducing delays between requests if necessary.

---

## **License**

Licensed under the **MIT License**.
