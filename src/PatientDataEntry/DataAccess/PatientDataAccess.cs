using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PatientDataEntry.Models;
using System.Collections.Generic;
using System.IO;

namespace PatientDataEntry.DataAccess
{
    public class PatientDataAccess
    {
        private string patientFile = "allPatients.txt";

        public void addPatient(Patient patient)
        {
            using (var sw = System.IO.File.AppendText(this.patientFile))
            {
                var searializer = JsonSerializer.Create();
                sw.WriteLine();
                searializer.Serialize(sw, patient);
                sw.Flush();
            }
        }

        public IEnumerable<Patient> getAllPatients()
        {
            List<Patient> patients = new List<Patient>();
            using (var or = System.IO.File.OpenRead(this.patientFile))
            {
                using (var sr = new StreamReader(or))
                {
                    while (!sr.EndOfStream)
                    {
                        var line = sr.ReadLine();
                        if (string.IsNullOrEmpty(line) == false)
                        {
                            var patient = JsonConvert.DeserializeObject<Patient>(line);
                            patient.FirstName = "";
                            patients.Add(patient);
                        }
                    }
                }
            }

            return patients;
        }
    }
}
