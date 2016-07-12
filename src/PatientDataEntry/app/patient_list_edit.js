(function () {
    'use strict';
    
    angular
        .module('patientListEdit', [
            'ngComponentRouter',
            'ngMask',
            'patientList'
        ])
        .component('patientListEdit', {
            selector: 'patientListEdit',
            templateUrl: 'app/view/patient/list/edit.html',
            controller: ['$scope', 'patientList', createPatientDataController],
            controllerAs: 'vc',
        })
    ;

    function createPatientDataController(scope, patientListSingleton) {
        var viewController = createPatientDataViewController(scope, patientListSingleton, this);
	    return viewController;
    };

    function createPatientDataViewController(scope, patientListSingleton, viewController) {
        viewController.model = viewController.model ? viewController.model : initModel();
        
        viewController.onSave = function () {
            if (scope.patientEntryForm.$valid) {
                var uploadingModel = viewController.model;
                viewController.onBeforePatientUpload(uploadingModel);
                patientListSingleton.uploadPatientAsync(uploadingModel);
            }
        };

        viewController.onClear = function () {
            viewController.model = initModel();
        };

        viewController.onPropertyChanged = function (newVal) {
            viewController.model.DoesHaveValues = viewController.calculateDoesModelHaveValues(viewController.model);
        };

        viewController.onBeforePatientUpload = function (uploadingModel) {
            uploadingModel.SyncStatus = 'uploading';
            window.setTimeout(function () {
                viewController.model = initModel();
                scope.patientEntryForm.$setPristine();
                scope.patientEntryForm.$setUntouched();
                scope.$applyAsync();
            }, 10);
        };

        viewController.calculateDoesModelHaveValues = function (object) {
            for (var key in object) {
                if (object[key] instanceof Object) {
                    if (viewController.doesHaveValues(object[key])) {
                        return true;
                    }
                } else if (key && -1 == ['DoesHaveValues', 'SyncStatus', 'DuplicateFound', 'Message'].indexOf(key) && object[key]) {
                    return true;
                    scope.$applyAsync();
                }
            }
            return false;
        };

        scope.$watch(function () { return viewController.model.FirstName; }, viewController.onPropertyChanged);
        scope.$watch(function () { return viewController.model.LastName; }, viewController.onPropertyChanged);
        scope.$watch(function () { return viewController.model.Ssn; }, viewController.onPropertyChanged);
        scope.$watch(function () { return viewController.model.Zip; }, viewController.onPropertyChanged);
        scope.$watch(function () { return viewController.model.State; }, viewController.onPropertyChanged);

        return viewController;
    };

    function initModel() {
        var model = {};
        model.SyncStatus = 'new';
        model.DoesHaveValues = false;

        return model;
    }
})();