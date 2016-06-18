(function () {
    'use strict';

    angular
        .module('app')
        .controller('Main', main);

    function main($scope) {
        var viewController = createviewController(this, $scope);
    };

    function createviewController(viewController, $scope) {
        viewController.model = viewController.model ? viewController.model : initModel();

        viewController.onSave = function () {
            viewController.upload();
        };

        viewController.onClear = function () {
            viewController.resetModel();
        };

        viewController.upload = function () {
            var uploadingModel = viewController.uploadModel();
            viewController.resetModel();
            viewController.patientList.push(uploadingModel);
        };

        viewController.resetModel = function () {
            viewController.model = initModel();
        };

        viewController.uploadModel = function () {
            var json = JSON.stringify(viewController.model);
            var uploadingModel = JSON.parse(json);
            uploadingModel.syncStatus = 'uploading';
            //TODO: FTP            
            setTimeout(function () {
                uploadingModel.syncStatus = 'upload successful';
                $scope.$applyAsync();
            }, 5000);

            return uploadingModel;
        }

        viewController.patientList = [];

        return viewController;
    };

    function initModel() {
        var model = {};
        model.syncStatus = 'new';
        return model;
    }
})();