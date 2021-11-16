# Commerce.js Integration Template

This repo serves as a template for creating an integration that runs on the Commerce.js infrastructure. Integrations
communicate with third party services and apps, and allow merchants using the Chec Dashboard to create and configure
these integrations with an experience which can be completely customised by the integration.

## The anatomy of an integration

"Integration" refers to a configured instance of an "integration template". This repo represents and integration
template. The code here will be used by the Commerce.js infrastructure to create configured "integration" instances on
demand for merchants using Commerce.js.

Integration templates usually consist of two parts;
- an "integration handler" that is deployed to the Commerce.js infrastructure and handles webhook events or customer
requests,
- and (optionally) a small web app that customises the configuration experience for the merchant enabling integrations
through the Chec Dashboard.

The configuration experience is optional, as an integration template can simply specify fields to display to a merchant
during configuration, or may require no configuration at all, in some cases.

## Getting started

You can create your own integration by cloning this repo, or using the "Use this template" button provided by GitHub.

### Integration handler

The code for the integration handler is within the `integration` folder. Integrations are triggered by webhook events.
Your integration can react differently to events by inspecting the event in the request body available to the
integration handler. The integration instance (as provided by the Chec API) can be fetched from the provided `context`
object:

```js
const integration = await context.integration();
```

This integration object contains the integration configuration that was set by the merchant when they created the
integration.

The request object provided to your integration function offers information about the request/event that triggered the
integration, and context object provides context and helpers to facilitate the work your integration needs to do. The
TypeScript type definitions for integrations are installed as an NPM dependency, and provide more insight into what's
available.

### Configuration app

If you need more than just basic fields to configure your integration, you can customise the configuration experience
by building a configuration app. The initial code for this is provided in the `configuration-app` directory. More
information about building a configuration app can be found in the documentation for the
`integration-configuration-sdk`: https://github.com/chec/integration-configuration-sdk

Configuration apps allow you to provide a custom configuration experience that you might need to configure your
integration with a third party service. For instance, you can dynamically update options to choose from after a user has
entered an API key, or you could implement a full oAuth2 authentication flow within the frame so that the user doesn't
have to leave the Chec dashboard during configuration of an integration.

## Testing your integration handler

TODO

## Integration configuration form schema

You can configure integrations without having to build a configuration app. When adding your integration template to the
Chec Dashboard, you may specify a "form schema" that describes a form that will be rendered in the Chec Dashboard. The
schema is a JSON array of objects that represent fields to show. The minimum detail required for a field is:

```json5
{
  "key": "my_field", // An identifier for the field, and the "key" that the value will be saved to in config
  "label": "My field", // A label to be used for the field
  "type": "short_text" // One of a few available types of fields. This shows a basic text input
}
```

After the user configures an integration fills in a value for the field specified, the configuration of an integration
will have a `my_field` key that matches the value given by the user.

This form schema can also be used by a configuration app to dynamically control configuration while not having to render
a custom UI.

### Available field types:

| Field "type" | Description |
|---|---|
| `short_text` | A small text input (ie. `<input type="text">`). |
| `long_text` | A larger text area. |
| `number` | A text input that requires a number and shows a spinner. |
| `wysiwyg` | A formattable text area that produces HTML. |
| `boolean` | Renders a switch. |
| `select` | Shows a dropdown. Options should be provided under the `options` key of the field schema, as an array of objects with `label` and `value` keys. Additionally, you may specify `multiselect: true` to allow multiple selections. |
| `button` | Show a button with a label. This will not affect the configuration, but can be used by configuration apps which can watch for click events on the button. |
| `link` | Show a link that renders in the same style as a button. This link will open in a new window/tab. You will need to provide an `href` attribute in the schema for the link. |

### Additional options for fields

Some field types provide more options for controlling their display. Most support the following additional options

| Option | Type | Description |
|---|---|---|
| `default` | `mixed` | The default value for the field |
| `description` | `string` | A description to show alongside the field in the Dashboard. |
| `disabled` | `boolean` | Indicates that the field should appear disabled. |
| `required` | `boolean` | Indicates that the field is required before the integration can be created |

### Sub-schemas

TODO

## Bundling your integration for usage

There are two parts to this integration repo that are built independently

### Integration handler

The Commerce.js integrations do not support any build pipeline. Integration handlers will need to be built and bundled
into a tags that will be deployed. Integration handlers are configured in this repository to be bundled with
`@vercel/ncc`. You may run `yarn build` to bundle the integration handler along with the configuration app, or run
`yarn build:integration` to build only the integration. When you configure the template with the Chec API/Dashboard,
you only need to specify the distribution file for the integration handler (`dist/integration/index.js` by default).

### Configuration app

The configuration app uses `parcel`, a lightweight web app bundler, to produce an easily hostable web app. The
integration template will need to be given a web accessible URL where it can access this app. The Chec API does not
currently provide any hosting service for this, but there are a few easy and free options including Netlify, Vercel, or
even a publicly routable AWS S3 bucket.

When using Netlify or Vercel, you can use `yarn build:config` to produce a version of the app, and `dist/config` as a
web route for your deployment.

## Adding your integration to the Chec Dashboard

TODO add detail indicating how you submit custom integrations when support is added to the Chec API/dashboard

## Troubleshooting

#### `Uncaught ReferenceError: regeneratorRuntime`

Sometimes, integration configuration apps may bring in third party modules that expect to be compiled with Babel. In
this case, bundling  your configuration app may fail with an error relating to `regeneratorRuntime` being unavailable or
undefined. You can resolve this by including and bundling the babel `regeneratorRuntime` polyfill:

Add the following babel config to your `package.json`:

```json
"babel": {
  "presets": [
    "@parcel/babel-preset-env",
    "@babel/preset-react"
  ],
  "plugins": [
    "@parcel/babel-plugin-transform-runtime"
  ]
},
```

And then add the polyfill import to `configuration-app/index.ts`

```ts
import 'regenerator-runtime/runtime';
```

