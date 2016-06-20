using Microsoft.AspNetCore.Mvc;
using PatientDataEntry.Models;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.IO;
using PatientDataEntry.DataAccess;

namespace PatientDataEntry.Controllers
{
    [Route("api/[controller]")]
    public class PatientDataController
    {
        private PatientDataAccess pda = new PatientDataAccess();

        // GET api/values
        [HttpGet]
        public IEnumerable<Patient> Get()
        {
            return pda.getAllPatients();
        }

        // add an item to the list
        [HttpPost]
        public HttpResponseMessage Post([FromBody]Patient patient)
        {
            pda.addPatient(patient);
            return new HttpResponseMessage() { StatusCode = HttpStatusCode.Accepted, ReasonPhrase = string.Format("Patient {0} on server", patient.Ssn) };
        }
    }
}