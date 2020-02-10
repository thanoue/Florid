using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Florid.Entity
{
    public class User : BaseEntity
    {
        public string AvtUrl { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string FullName { get; set; }
        public Role Role {get;set;}

        public LoginModel LoginModel { get; set; }

        public User()
        {
            LoginModel = new LoginModel();
        }
    }

    public class LoginModel
    {
        public string UserName { get; set; }
        public string Passcode { get; set; }
    }

    public enum Role
    {
        Admin,
        Shipper,
        CustomerService,
        Florist,
        Others
    }
}
