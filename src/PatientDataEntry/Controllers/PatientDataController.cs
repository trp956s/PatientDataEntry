using Microsoft.AspNetCore.Mvc;
using PatientDataEntry.Models;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;

namespace PatientDataEntry.Controllers
{
    [Route("api/[controller]")]
    public class PatientDataController
    {
        private static List<Patient> PatientData =
            new List<Patient> (new Patient[]{
                new Patient() {
                    FirstName = "Tom",
                    LastName = "Pepe",
                    Ssn="111-11-1111",
                },
                new Patient() {
                    FirstName = "Holly",
                    LastName = "Pepe",
                    Ssn="111-11-1111",
                },
                new Patient() {
                    FirstName = "Grayson",
                    LastName = "Pepe",
                    State="Missouri"
                },
                new Patient() {
                    FirstName = "Merissa",
                    LastName = "Pepe",
                    Zip="65802"
                },
            });

        // GET api/values
        [HttpGet]
        public IEnumerable<Patient> Get()
        {
            return PatientData;
        }

        // add an item to the list
        [HttpPost]
        public HttpResponseMessage Post([FromBody]Patient patient)
        {
            //TODO: replace with data File IO is "OK"
            PatientData.Add(patient);
            return new HttpResponseMessage() { StatusCode = HttpStatusCode.Accepted, ReasonPhrase = "Patient Data on Server" };
        }
    }
}