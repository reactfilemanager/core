import FileManager from './src/file-manager';

window.$ = window.jQuery = require('jquery');
require('jquery.easing');
require('popper.js');
require('bootstrap');

const element = document.querySelector('#file-manager');

FileManager(element, {url: 'http://127.0.0.1:8000/'});
