import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MessageCircle, MapPin, Filter, Plus } from "lucide-react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import AddProductModal from "@/components/AddProductModal";
import AuthModal from "@/components/AuthModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  seller: {
    name: string;
    whatsapp: string;
    campus: string;
  };
  images: string[];
  createdAt: string;
  sold?: boolean;
  sellerEmail?: string;
}

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userCampus, setUserCampus] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState("All");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();

  const categories = ["All", "Textbooks", "Notes", "Electronics", "Stationery", "Miscellaneous"];
  const priceRanges = ["All", "Under ₹500", "₹500-₹2000", "₹2000-₹10000", "Above ₹10000"];

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setIsAuthenticated(true);
          const domain = session.user.email?.split("@")[1] || "";
          setUserCampus(domain);
          setUserEmail(session.user.email || "");
          localStorage.setItem("userEmail", session.user.email || "");
        } else {
          setIsAuthenticated(false);
          setUserCampus("");
          setUserEmail("");
          setProducts([]);
          setFilteredProducts([]);
          localStorage.removeItem("userEmail");
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsAuthenticated(true);
        const domain = session.user.email?.split("@")[1] || "";
        setUserCampus(domain);
        setUserEmail(session.user.email || "");
        localStorage.setItem("userEmail", session.user.email || "");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProducts = async () => {
    if (!isAuthenticated || !userCampus) return;
    
    setIsLoading(true);
    try {
      const campusFilter = userCampus.replace(".", "-").toLowerCase();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('campus', campusFilter)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error",
          description: "Failed to load products. Please refresh the page.",
          variant: "destructive",
        });
      } else {
        // Transform the data to match the existing Product interface
        const transformedProducts: Product[] = (data || []).map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          price: item.price,
          category: item.category,
          condition: item.condition,
          seller: {
            name: item.seller_name,
            whatsapp: item.whatsapp_number,
            campus: item.campus
          },
          images: [item.image_url || "/placeholder.svg"],
          createdAt: item.created_at,
          sold: item.sold,
          sellerEmail: item.seller_email
        }));
        
        setProducts(transformedProducts);
      }
    } catch (error) {
      console.error('Unexpected error fetching products:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading products.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [isAuthenticated, userCampus]);

  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (priceRange !== "All") {
      filtered = filtered.filter(product => {
        const price = product.price;
        switch (priceRange) {
          case "Under ₹500":
            return price < 500;
          case "₹500-₹2000":
            return price >= 500 && price <= 2000;
          case "₹2000-₹10000":
            return price >= 2000 && price <= 10000;
          case "Above ₹10000":
            return price > 10000;
          default:
            return true;
        }
      });
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, priceRange]);

  const handleLogin = (email: string) => {
    // Auth state will be handled by the onAuthStateChange listener
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // State cleanup will be handled by the onAuthStateChange listener
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setPriceRange("All");
  };

  const handleProductAdded = () => {
    // Refresh the products list when a new product is added
    fetchProducts();
  };

  const handleProductUpdate = (productId: string, updates: Partial<Product>) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId ? { ...product, ...updates } : product
      )
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header 
          isAuthenticated={false}
          onLogin={() => setShowAuthModal(true)}
          onLogout={handleLogout}
        />
        
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-blue-600">Campus Mart</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Buy and sell items within your campus community. Connect directly with fellow students through WhatsApp.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setShowAuthModal(true)}
                className="text-lg px-8 py-3"
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-3"
              >
                Learn More
              </Button>
            </div>
          </div>
          
          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Campus-Based</h3>
              <p className="text-gray-600">Only students from your campus can view and contact you</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">WhatsApp Connect</h3>
              <p className="text-gray-600">Direct communication through WhatsApp for easy transactions</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <Search className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Discovery</h3>
              <p className="text-gray-600">Find exactly what you need with powerful search and filters</p>
            </div>
          </div>
        </div>

        <Footer />

        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        isAuthenticated={true}
        onLogin={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        userCampus={userCampus}
      />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search books, notes, electronics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              onClick={() => setShowAddProductModal(true)}
              className="lg:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Sell Item
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <span className="font-medium text-gray-700">Categories:</span>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter Price" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  currentUserEmail={userEmail}
                  onProductUpdate={handleProductUpdate}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-xl font-semibold text-gray-500 mb-2">No items found</h3>
                <p className="text-gray-400">
                  {products.length === 0 
                    ? "Be the first to list an item on your campus!"
                    : "Try adjusting your search criteria or clear filters"
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />

      <AddProductModal
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        userCampus={userCampus}
        onProductAdded={handleProductAdded}
      />

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default Index;
