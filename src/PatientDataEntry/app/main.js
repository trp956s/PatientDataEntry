(function () {
    'use strict';

    angular
        .module('app')
        .controller('Main', main);

    function main($scope) {
        var viewController = createViewController(this, $scope);
    };

    function createViewController(viewController, $scope) {
        viewController.urlList = {
            'getPatientList' : 'api/PatientData'
        };
        
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
            viewController.PatientList.push(uploadingModel);
            viewController.checkForDuplicateSsns();
            $scope.$applyAsync();
        };

        viewController.resetModel = function () {
            viewController.model = initModel();
        };

        viewController.uploadModel = function () {
            var json = JSON.stringify(viewController.model);
            var uploadingModel = JSON.parse(json);
            uploadingModel.SyncStatus = 'uploading';
            //TODO: FTP            
            setTimeout(function () {
                uploadingModel.SyncStatus = 'upload successful';
                $scope.$applyAsync();
            }, 5000);

            return uploadingModel;
        }

        viewController.checkForDuplicateSsns = function () {
            for(var i = viewController.PatientList.length - 1; i > 0; i--) {
                var model = viewController.PatientList[i];
                if (!model.DuplicateFound) {
                    viewController.checkForDuplicateSsn(model);
                }
            }
        }

        viewController.checkForDuplicateSsn = function(model) {
            for(var i = 0; i < viewController.PatientList.length; i++) {
                if (viewController.PatientList[i] !== model && viewController.PatientList[i].ssn == model.Ssn) {
                    model.Message = 'error duplicate social security number!';
                    model.Ssn = '666-' + model.Ssn.substring(4, model.Ssn.length);
                    model.DuplicateFound = true;
                    $scope.$applyAsync();
                    break;
                }
            }
        }

        viewController.loadPatientList = function () {
            $.ajax({
                url: viewController.urlList.getPatientList
            }).done(viewController.setPatientList);
        }

        viewController.setPatientList = function (PatientListData) {
            viewController.PatientList = PatientListData;
            $scope.$applyAsync();
        };

        viewController.PatientList = viewController.loadPatientList();

        return viewController;
    };

    function initModel() {
        var model = {};
        model.SyncStatus = 'new';
        return model;
    }
})();