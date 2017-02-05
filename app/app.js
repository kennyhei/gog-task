'use strict';

// Declare app level module which depends on views, and components
var GogApp = angular.module('GogApp', ['ngRoute', 'ngAnimate', 'firebase', 'youtube-embed']);

GogApp.config(function($locationProvider) {

    $locationProvider.hashPrefix('!');
});