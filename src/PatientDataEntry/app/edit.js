(function () {
    'use strict';

    angular
        .module('patientDataEntryForm', ['ngRoute', 'ngMask'])
        .component('patientDataEntryForm', {
            selector: 'patientDataEntryForm',
            template: 'app/view/patient/list/edit.html',
            controller: ['$routeParams', createPatientDataController],
            controllerAs: 'vc',
        })
    ;

    function createPatientDataController($scope) {
        var viewController = createPatientDataViewController(this, $scope);
    };

    function createPatientDataViewController(viewController, $scope) {
        viewController.urlList = {
            'getPatientList': 'api/PatientData',
            'addPatient': 'api/PatientData',
        };

        viewController.model = viewController.model ? viewController.model : initModel();

        viewController.onSave = function () {
            if ($scope.patientEntryForm.$valid) {
                viewController.upload();
            }
        };

        viewController.onPropertyChanged = function (newVal) {
            viewController.model.DoesHaveValues = viewController.doesHaveValues(viewController.model);
        };

        viewController.upload = function () {
            var uploadingModel = viewController.uploadModel();

            window.setTimeout(function () {
                viewController.model = initModel();
                viewController.PatientList.unshift(uploadingModel);
                viewController.checkForDuplicateSsns();
                $scope.patientEntryForm.$setPristine();
                $scope.patientEntryForm.$setUntouched();
            }, 10);
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
                patientListData[i].SyncStatus = 'Patient ' + patientListData[i].Ssn + ' recieved from server';
                $scope.$applyAsync();
            }
        };

        viewController.PatientList = viewController.loadPatientList();

        viewController.model.DoesHaveValues = false;

        viewController.doesHaveValues = function (object) {
            for (var key in object) {
                if (object[key] instanceof Object) {
                    if (viewController.doesHaveValues(object[key])) {
                        return true;
                    }
                } else if (key && -1 == ['DoesHaveValues', 'SyncStatus', 'DuplicateFound', 'Message'].indexOf(key) && object[key]) {
                    return true;
                    $scope.$applyAsync();
                }
            }
            return false;
        };

        $scope.$watch(function () { return viewController.model.FirstName; }, viewController.onPropertyChanged);
        $scope.$watch(function () { return viewController.model.LastName; }, viewController.onPropertyChanged);
        $scope.$watch(function () { return viewController.model.Ssn; }, viewController.onPropertyChanged);
        $scope.$watch(function () { return viewController.model.Zip; }, viewController.onPropertyChanged);
        $scope.$watch(function () { return viewController.model.State; }, viewController.onPropertyChanged);

        return viewController;
    };

    function initModel() {
        var model = {};
        model.SyncStatus = 'new';
        
        return model;
    }
})();