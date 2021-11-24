import { IntegrationHandler } from '@chec/integration-handler';
import { ConfigurationType } from '../configuration-type';

const handler: IntegrationHandler<ConfigurationType> = async (request, context) => {
  // Integrations are run by events, usually from a webhook. The event that triggered this action is available within
  // the body of the request
  switch (request.body.event) {
    case 'integrations.ready':
      // Perform work on the first run of an integration - eg. setting up with an external service for the first time
    case 'orders.create':
      // Perform work based on the "order.create" webhook invocation. Integrations are configured to only handle
      // specific webhook events, so ensure that the integration template is configured with the right webhook events.
  }

  return {
    statusCode: 200,
    body: '',
  };
};

export = handler;
