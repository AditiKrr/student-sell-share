
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ShoppingBag, User, LogOut } from "lucide-react";

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

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-blue-600">Campus Mart</h1>
          </div>
          
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
