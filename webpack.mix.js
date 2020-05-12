const fs = require('fs');
const mix = require('laravel-mix');
const webpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */
mix.setPublicPath('dist');
mix.react('build.js', 'dist/build.js').sass('style.scss', 'dist/build.css').copy('index.html', 'dist').webpackConfig({
      module: {
        rules: [
          {
            test: /\.svg$/,
            loader: 'raw-loader',
          },                {
            test: /\.jsx?$/,
            loader: 'babel-loader',
            query: {presets:['@babel/react'], plugins: ['@babel/plugin-proposal-class-properties']},
            include: [fs.realpathSync(path.resolve(__dirname, './node_modules/@reactfilemanager'))]
          }
        ],
      },
      plugins: [
        // new webpackBundleAnalyzer(),
      ],
    },
).sourceMaps();
