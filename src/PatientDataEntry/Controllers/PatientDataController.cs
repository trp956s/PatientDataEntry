using Microsoft.AspNetCore.Mvc;
using PatientDataEntry.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PatientDataEntry.Controllers
{
    [Route("api/[controller]")]
    public class PatientDataController
    {
        // GET api/values
        [HttpGet]
        public IEnumerable<Patient> Get()
        {
            return new Patient[] {
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
            };
        }

        
    }
}
