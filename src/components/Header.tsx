import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ShoppingBag, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
  userCampus?: string;
}

const Header = ({ isAuthenticated, onLogin, onLogout, userCampus }: HeaderProps) => {
  const formatCampusName = (campus: string) => {
    return campus.split(".")[0].toUpperCase().replace("-", " ");
  };

  const getFullCollegeName = (campus: string) => {
    const campusMap: { [key: string]: string } = {
      "iitd.ac.in": "IIT Delhi",
      "iitb.ac.in": "IIT Bombay", 
      "iitm.ac.in": "IIT Madras",
      "iitk.ac.in": "IIT Kanpur",
      "iitkgp.ac.in": "IIT Kharagpur",
      "iitr.ac.in": "IIT Roorkee",
      "iitg.ac.in": "IIT Guwahati",
      "iith.ac.in": "IIT Hyderabad",
      "student.iitd.ac.in": "IIT Delhi",
      "nitt.edu": "NIT Tiruchirappalli",
      "nitw.ac.in": "NIT Warangal",
      "iisc.ac.in": "Indian Institute of Science Bangalore",
      "du.ac.in": "Delhi University",
      "jnu.ac.in": "Jawaharlal Nehru University", 
      "bhu.ac.in": "Banaras Hindu University",
      "amu.ac.in": "Aligarh Muslim University",
      "hyderabad.bits-pilani.ac.in": "BITS Pilani, Hyderabad Campus",
      "pilani.bits-pilani.ac.in": "BITS Pilani, Pilani Campus",
      "goa.bits-pilani.ac.in": "BITS Pilani, Goa Campus",
      "dubai.bits-pilani.ac.in": "BITS Pilani, Dubai Campus",
      "dtu.ac.in": "Delhi Technological University",
      "nsit.ac.in": "Netaji Subhas University of Technology",
      "vit.ac.in": "Vellore Institute of Technology",
      "manipal.edu": "Manipal Academy of Higher Education",
      "srm.ap.edu": "SRM University, Andhra Pradesh"
    };
    
    return campusMap[campus] || formatCampusName(campus);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-blue-600">Campus Mart</h1>
              {isAuthenticated && userCampus && (
                <span className="text-sm font-light text-gray-600">
                  {getFullCollegeName(userCampus)}
                </span>
              )}
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated && userCampus && (
              <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
                📍 {formatCampusName(userCampus)}
              </div>
            )}
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="space-x-2">
                <Button variant="ghost" onClick={onLogin}>
                  Login
                </Button>
                <Button onClick={onLogin}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
