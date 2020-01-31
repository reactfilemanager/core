const tailwindCss  = require('tailwindcss');
const mix = require('laravel-mix');

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
mix.react('build.js', 'dist/build.js')
   .sass('style.scss', 'dist/build.css')
   .copy('node_modules/@fortawesome/fontawesome-free/webfonts', 'dist/fonts')
   .copy('index.html', 'dist')
   .options({
              processCssUrls: false,
              postCss: [tailwindCss(path.join(__dirname, 'tailwind.config.js'))],
            })
   .sourceMaps();
