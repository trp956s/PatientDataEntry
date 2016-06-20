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
            'getPatientList': 'api/PatientData',
            'addPatient': 'api/PatientData',
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

            $.ajax({
                'type': 'POST',
                'url': viewController.urlList.addPatient,
                'data': json,
                contentType: 'application/json; charset=utf-8',
                dataType: 'html',
            }).done(function (data) {
                viewController.afterPatientUpload(uploadingModel, data);
            });

            return uploadingModel;
        };

        viewController.afterPatientUpload = function (uploadingModel, data) {
            try{
                uploadingModel.SyncStatus = JSON.parse(data).ReasonPhrase;
            } catch (exception) {
                uploadingModel.SyncStatus = 'upload successful';
            }
            
            $scope.$applyAsync();
        };

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
                if (viewController.PatientList[i] !== model && viewController.PatientList[i].Ssn == model.Ssn) {
                    var ssn = model.Ssn ? model.Ssn : "";
                    model.Message = 'Error! Duplicate social security number.  Replacing the first 3 characters with 666';
                    model.Ssn = '666-' + ssn.substring(4, ssn.length);
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

        viewController.setPatientList = function (patientListData) {
            viewController.PatientList = patientListData;
            viewController.checkForDuplicateSsns();
            $scope.$applyAsync();
            for (var i = 0; patientListData && i < patientListData.length; i++) {
                patientListData[i].SyncStatus = 'Recieved from server';
                $scope.$applyAsync();
            }
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