# LiveData.js

[![Node.js Package](https://github.com/diolan12/livedata/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/diolan12/livedata/actions/workflows/npm-publish.yml)
[![NPM downloads](https://img.shields.io/npm/dm/js-livedata.svg?style=flat)](https://npmcharts.com/compare/js-livedata?minimal=true)
[![NPM version](https://img.shields.io/npm/v/js-livedata.svg?style=flat)](https://npmjs.org/package/js-livedata)
[![pages-build-deployment](https://github.com/diolan12/livedata/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/diolan12/livedata/actions/workflows/pages/pages-build-deployment)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

LiveData.js is a lightweight observable data holder class inspired from Google Android Jetpack library

## Import using CDN

```html
<script src="https://unpkg.com/js-livedata@1.0.0/livedata.min.js"></script>
```

## Usage

```js
const data = new LiveData()
// or instantiate with value
const data = new LiveData('Hello World!')
```

## Observing a LiveData

```js
const data = new LiveData()

data.observe(v => {
    console.log('observe', v)
})
```

## Debounced and Throttled Mechanism

For debounced and throttled mechanism, the default delay are set to 500. You can change the delay in the second parameter.

### Debounced Mechanism

```js
const data = new LiveData()

data.observeDebounce(v => {
    console.log('observe', v)
})
```

### Throttled Mechanism

```js
const data = new LiveData()

data.observeThrottle(v => {
    console.log('observe', v)
})
```

### Custom delay

```js
const data = new LiveData()

data.observeDebounce(v => {
    console.log('observe', v)
}, 1300)
```

## Set a Value

You can post a value and then all the observer getting instant notify.

```js
const data = new LiveData()

data.observe(v => {
    console.log('observe', v)
})

data.postValue('Hello World!')
```

## LiveValidator Class

This is an extension class which is quite useful to validate an input form.

```js
const validator = new LiveValidator()
// or with defined keys
const validator = new LiveValidator(['username', 'password'])
```

### Observing a LiveValidator

The callback return two value which is `validity` value (boolean) and the `Map` object.
With `validity` boolean value you can do anything like disabling a button for a login form.
For more demo you can check out the [LiveData.js page](https://diolan12.github.io/livedata/)

```js
validator.observe((validity, map) => {
    console.log('validator', validity, map)
})
```

### Set a key validity

You can define how you validate the data in here, the first parameter are key (string) and the second one is a boolean.

```js
validator.set('username', someValue != '' && someValue.length >= 8)
```
