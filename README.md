# chrome-xxxx

<!-- [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] -->

This is a Chrome Extension which supports inputing the █ symbol.

Chrome web store: https://chrome.google.com/webstore/detail/easy-%E2%96%88%E2%96%88%E2%96%88%E2%96%88ing/boohjpnhpempgagincffdolllgjeohci

## Development
The following gulp tasks are useful:

- **default**: compile the TypeScript source codes, lint them and bundle them into a single JavaScript file.
- **watch**: watch the source codes.

These tasks minimise the result when the `NODE_ENV` environment variable is set to `production`.

The following npm script is also useful:

- **package**: pack generated files and other items into `chrome-extension/app` directory and zip it into `chrome-extension/app.zip`. This directory should be able to be loaded into Chrome.

## Contributors
Be the first contributor!

## License

MIT © [uhyo]()
