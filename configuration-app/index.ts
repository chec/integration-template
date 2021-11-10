import { createSDK } from '@chec/integration-configuration-sdk';

(async () => {
  const sdk = await createSDK();

  // Refer to the configuration SDK docs to provide advice on building your custom configuration app:
  // https://github.com/chec/integration-configuration-sdk

  document.getElementById("app").innerHTML = `
    Hello Chec Dashboard!
  `;
})();


