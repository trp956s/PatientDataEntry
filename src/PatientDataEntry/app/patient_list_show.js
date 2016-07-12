(function () {
    'use strict';
    
    angular
        .module('patientListShow', [
           'patientList',
        ])
        .component('patientListShow', {
            templateUrl: 'app/view/patient/list/show.html',
            controller: ['$scope', 'patientList', createPatientShowController],
            controllerAs: 'vc',
        })
    ;

    function createPatientShowController(scope, patientListSingleton) {
        var viewController = this;

        viewController.onPatientListReturnedFromServer = function (patientListData) {
            viewController.setPatientList(patientListData.detail.serverResponse);
        };

        viewController.onPatientUploadToServerStarted = function (patientUploadData) {
            viewController.addPatientToTopOfList(patientUploadData.detail.patient);
        };

        viewController.onPatientUploadedToServer = function (patientUploadData) {
            viewController.markStatusAsUploaded(patientUploadData.detail.patient);
        };

        viewController.checkForDuplicateSsns = function () {
            for (var i = viewController.PatientList.length - 1; i > 0; i--) {
                var model = viewController.PatientList[i];
                if (!model.DuplicateFound) {
                    viewController.checkForDuplicateSsn(model);
                }
            }
        };

        viewController.checkForDuplicateSsn = function (model) {
            for (var i = 0; i < viewController.PatientList.length; i++) {
                if (viewController.PatientList[i] !== model && viewController.PatientList[i].Ssn == model.Ssn) {
                    var ssn = model.Ssn ? model.Ssn : "";
                    model.Message = 'Error! Duplicate social security number.  Replacing the first 3 characters with 666';
                    model.Ssn = '666-' + ssn.substring(4, ssn.length);
                    model.DuplicateFound = true;
                    scope.$applyAsync();
                    break;
                }
            }
        };

        viewController.loadPatientList = function () {
            patientListSingleton.requestPatientListAsync();
        };

        viewController.setPatientList = function (patientList) {
            viewController.PatientList = patientList;
            viewController.checkForDuplicateSsns();
            scope.$applyAsync();
            for (var i = 0; patientList && i < patientList.length; i++) {
                patientList[i].SyncStatus = 'Patient ' + patientList[i].Ssn + ' recieved from server';
                scope.$applyAsync();
            }
        };

        viewController.addPatientToTopOfList = function (uploadingModel) {
            debugger;
            viewController.PatientList.unshift(uploadingModel);
            scope.$applyAsync();
        };

        viewController.markStatusAsUploaded = function (uploadingModel) {
            try {
                uploadingModel.SyncStatus = JSON.parse(data).ReasonPhrase;
            } catch (exception) {
                uploadingModel.SyncStatus = 'upload successful';
            }

            scope.$applyAsync();
        }

        document.addEventListener(patientListSingleton.eventList.patientListReturnedFromServer, viewController.onPatientListReturnedFromServer);
        document.addEventListener(patientListSingleton.eventList.patientUploadToServerStarted, viewController.onPatientUploadToServerStarted);
        document.addEventListener(patientListSingleton.eventList.patientUploadedToServer, viewController.onPatientUploadedToServer);

        viewController.loadPatientList();

        return viewController;
    };
})();