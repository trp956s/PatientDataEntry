using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PatientDataEntry.Models
{
    public struct Patient
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Ssn { get; set; }
        public string Zip { get; set; }
        public string State { get; set; }
    }
}
