module.exports = (args) => {
  args = args || {}

  const dev                        = args.env === 'development'
  const prod                       = args.env === 'production'
  const noscript                   = args.env === 'noscript'
  const path                       = require('path')
  const webpack                    = require('webpack')
  const ExtractTextPlugin          = require('extract-text-webpack-plugin')
  const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin')
  const BrowserSyncPlugin          = require('browsersync-webpack-plugin')

  // CSS Loaders
  const secondaryCSS   = new ExtractTextPlugin('css/style.css')
  const criticalCSS    = new ExtractTextPlugin('css/critical.css')
  const sassLoaders    = [
    {
      loader: 'css-loader',
      options: {
        minimize: prod || noscript
      }
    },
    { loader: 'sass-loader' },
    {
      loader: 'sass-resources-loader',
      options: {
        resources: [
          '_mixins.scss',
          '_variables.scss'
        ].map(resource => {
          return path.resolve(__dirname, `./assets/scss/${resource}`)
        })
      }
    }
  ]

  const config  = {
    context: path.resolve(__dirname, './assets/'),
    devtool: dev ? 'inline-sourcemap': false,
    entry: './js/index.js',
    output: {
      path: path.resolve(__dirname, './dist/'),
      filename: 'js/scripts.min.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            { loader: 'babel-loader' }
          ]
        },
        {
          test: /\.scss$/,
          exclude: /\_critical.scss$/,
          use: [
            { loader: 'style-loader' },
            ...sassLoaders
          ]
        }
      ]
    },
    plugins: [
      criticalCSS,
      secondaryCSS,
      new ServiceWorkerWebpackPlugin({
        entry: path.join(__dirname, './assets/js/serviceWorker.js'),
        filename: 'sw.js',
        publicPath: '/'
      }),
      new BrowserSyncPlugin({
        // FIXME: make these values dynamic
        target:   'https://preemo.dev',
        proxyUrl: 'https://localhost:8000',
        watch:    [],
        https: {
          key:  path.join(__dirname, './server.key'),
          cert: path.join(__dirname, './server.crt'),
        }
      }),
      new webpack.optimize.UglifyJsPlugin()
    ]
  }

  const fallback = Object.assign({}, config, {
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            { loader: 'babel-loader' }
          ]
        },
        {
          test: /\_critical.scss$/,
          use: criticalCSS.extract(sassLoaders)
        },
        {
          test: /\.scss$/,
          exclude: /\_critical.scss$/,
          use: secondaryCSS.extract(sassLoaders)
        }
      ]
    }
  })

  return noscript ? fallback : config
}
