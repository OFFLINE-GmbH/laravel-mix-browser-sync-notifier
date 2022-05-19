# Laravel Mix Browser Sync Notifier

Display a Browser Sync notification for compilation errors in Laravel Mix

## Usage

Install the package:

```bash
npm i --save-dev @offlinech/laravel-mix-browser-sync-notifier
# yarn add -D @offlinech/laravel-mix-browser-sync-notifier
```

Then include it in your `webpack.mix.js`:


```js
const mix = require('laravel-mix')

require('@offlinech/laravel-mix-browser-sync-notifier')

mix
    .browserSync()
    .browserSyncNotifyErrors() 
```


