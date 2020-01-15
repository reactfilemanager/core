import FileManager from './src/file-manager';

window.$ = window.jQuery = require('jquery');
require('jquery.easing');
require('popper.js');
require('bootstrap');

const element = document.querySelector('#file-manager');

const local = 'http://dev.file-manager/server/';
const prod = 'https://file-manager.m3r.dev/server/';

FileManager(element, {url: 'http://dev.file-manager/server/'});
