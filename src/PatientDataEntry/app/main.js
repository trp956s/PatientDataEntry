(function () {
    'use strict';

    angular
        .module('app', [
            'ngComponentRouter',
            'patientDataEntryForm',
            'ngMask'
        ])
        .config(function ($locationProvider) {
            $locationProvider.html5Mode(true);
        })

        .value('$routerRootComponent', 'app')

        .component('app', {
            templateUrl: 'app/view/patient/form.html',
        })
    ;
})();