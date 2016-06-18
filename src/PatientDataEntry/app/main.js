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

        viewController.onSsnChanged = function () {
            alert();
        };

        viewController.upload = function () {
            var uploadingModel = viewController.uploadModel();
            viewController.resetModel();
            viewController.patientList.push(uploadingModel);
            viewController.checkForDuplicateSsns();
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

        viewController.checkForDuplicateSsns = function () {
            for(var i = viewController.patientList.length - 1; i > 0; i--) {
                var model = viewController.patientList[i];
                if (!model.duplicateFound) {
                    viewController.checkForDuplicateSsn(model);
                }
            }
        }

        viewController.checkForDuplicateSsn = function(model) {
            for(var i = 0; i < viewController.patientList.length; i++) {
                if (viewController.patientList[i] !== model && viewController.patientList[i].ssn == model.ssn) {
                    model.message = 'error duplicate social security number!';
                    model.ssn = '666-' + model.ssn.substring(4, model.ssn.length);
                    model.duplicateFound = true;
                    $scope.$applyAsync();
                    break;
                }
            }
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