(function () {
    'use strict';

    angular
        .module('app', [
            'ngComponentRouter',
            'patientList',
            'patientListEdit',
            'patientListShow',
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