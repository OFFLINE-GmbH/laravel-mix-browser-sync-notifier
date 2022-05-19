let mix = require('laravel-mix');

class WebpackNotifierPlugin {

    constructor (browserSync) {
        this.waitTimeout = null
        this.errors = []

        if (browserSync) {
            this.setBrowserSync(browserSync)
        }
    }

    apply (compiler) {
        compiler.hooks.done.tap('notifier', (stats) => {
            this.errors = stats.compilation.errors
            // Display the error after a timeout. Browser sync
            // usually triggers a reload. In this case, we need to
            // show the notification after the reload again.
            clearTimeout(this.waitTimeout)
            this.waitTimeout = setTimeout(this.notify.bind(this), 1500)
        })
    }

    notify () {
        if (!this.browserSync) {
            return
        }
        this.browserSync.browserSync.notify('<span style="color: #f00">ERROR</span><br><pre>' + this.errors.join('<br>') + '</pre>', 10000)
        this.errors = []
    }

    setBrowserSync (browserSync) {
        this.browserSync = browserSync
        this.browserSync.browserSync.emitter.on('browser:reload', () => {
            // Show errors after the browser was reloaded.
            if (this.errors.length > 0) {
                // Give clients time to reconnect.
                clearTimeout(this.waitTimeout)
                this.waitTimeout = setTimeout(() => {
                    this.notify()
                }, 1500)
            }
        })
    }
}

class LaravelMixBrowserSyncNotifyErrors {

    constructor () {
        this.browserSync = null
        this.webpackPlugin = new WebpackNotifierPlugin()
    }

    name () {
        return 'BrowserSyncNotifier'
    }

    dependencies () {
        return ['browser-sync']
    }

    webpackPlugins () {
        return this.webpackPlugin
    }

    webpackConfig (config) {
        const bs = config.plugins.find(plugin => plugin.hasOwnProperty('browserSync'));
        if (!bs) {
            throw new Error('Unable to find BrowserSync instance. Did you call .browserSync() in your webpack.mix.js?')
        }

        this.webpackPlugin.setBrowserSync(bs)
    }
}

mix.extend('browserSyncNotifyErrors', new LaravelMixBrowserSyncNotifyErrors());
