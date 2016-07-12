(function () {
    'use strict';
    
    var app = angular.module('patientList', []);
    app.provider('patientList', function () { this.$get = createPatientListSingleton; });

    function createPatientListSingleton() {
        var patientListSingleton = {};

        var dispatchPatientAddStarted = function (patient) {
            debugger;
            var evt = new CustomEvent(patientListSingleton.eventList.patientUploadToServerStarted, { "detail": { "patient": patient } });
            document.dispatchEvent(evt);
        };

        var dispatchPatientAdded = function (patient, serverResponse) {
            var evt = new CustomEvent(patientListSingleton.eventList.patientUploadedToServer, { "detail": { "patient": patient, "serverResponse": serverResponse } });
            document.dispatchEvent(evt);
        };

        var dispatchPatientListRequested = function (serverResponse) {
            var evt = new CustomEvent(patientListSingleton.eventList.patientListReturnedFromServer, { "detail": { "serverResponse": serverResponse } });
            document.dispatchEvent(evt);
        };

        //the URLs needed to perform the services in this object 
        var urlList = {
            getPatientList: "api/PatientData",
            addPatient: "api/PatientData",
        };

        patientListSingleton = {
            //Names of events on the document
            eventList: {
                patientUploadToServerStarted: "patientUploadToServerStarted",
                patientUploadedToServer: "patientUploadedToServer",
                patientListReturnedFromServer: "patientListReturnedFromServer"
            },

            //upload the provided model to the server and return the jQuery ajax request
            uploadPatientAsync: function (patient) {
                dispatchPatientAddStarted(patient);

                var json = JSON.stringify(patient);

                var xmlHttpRequest = $.ajax({
                    'type': 'POST',
                    'url': urlList.addPatient,
                    'data': json,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'html',
                });

                xmlHttpRequest.done(function (data) { dispatchPatientAdded(patient, data); });

                return xmlHttpRequest;
            },

            //get the patient list from the server
            requestPatientListAsync: function () {
                var xmlHttpRequest = $.ajax({
                    url: urlList.getPatientList
                });

                xmlHttpRequest.done(dispatchPatientListRequested)
            },
        }

        return patientListSingleton;
    };
})();