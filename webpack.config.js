module.exports = (args) => {
  args = args || {}

  const prod              = args.env === 'production'
  const noscript          = !!args.noscript
  const path              = require('path')
  const webpack           = require('webpack')
  const ExtractTextPlugin = require('extract-text-webpack-plugin')

  // CSS Loaders
  const secondaryCSS = new ExtractTextPlugin('css/style.css')
  const globalCSS    = new ExtractTextPlugin('css/global.css')
  const sassLoaders  = [
    {
      loader: 'css-loader',
      options: {
        minimize: prod
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
    devtool: !prod ? 'inline-sourcemap': false,
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
        // Inline CSS
        {
          test: /\_global.scss$/,
          use: globalCSS.extract(sassLoaders)
        },
        {
          test: /\.scss$/,
          exclude: /\_global.scss$/,
          use: [
            { loader: 'style-loader' },
            ...sassLoaders
          ]
        }
      ]
    },
    plugins: [
      globalCSS,
      secondaryCSS
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
        // Inline CSS
        {
          test: /\_global.scss$/,
          use: globalCSS.extract(sassLoaders)
        },
        {
          test: /\.scss$/,
          exclude: /\_global.scss$/,
          use: secondaryCSS.extract(sassLoaders)
        }
      ]
    }
  })

  return noscript ? fallback : config
}
