'use strict';

// Declare app level module which depends on views, and components
var GogApp = angular.module('GogApp', ['ngRoute', 'firebase', 'rzModule']);

GogApp.config(function($locationProvider) {

    $locationProvider.hashPrefix('!');
});
