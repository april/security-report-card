# Security Report Card

A simple (and experimental) WebExtension that will scan sites with the Mozilla Observatory as you browse along.

## Developing and Installing Locally

It is recommend that developers use [web-ext](https://github.com/mozilla/web-ext) for installation and testing.  It provides a number of useful features, such as automated installation and autoreload upon source changes. For testing and development, run the following commands in two separate terminal windows:

```bash
$ npm run-script watch
$ web-ext run --browser-console -s build --start-url 'https://badssl.com/'
```

If you are simply looking to give it a single run, you can compile it by running:

```bash
$ npm install
$ npm run-script compile
```

And then in Firefox, go to -> Add-ons -> Extensions -> (Gear Icon) -> Debug Add-ons -> Load Temporary Add-on

Navigate to `build/manifest.json` and it should start running immediately.