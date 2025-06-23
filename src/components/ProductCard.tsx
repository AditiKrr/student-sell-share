
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, MapPin } from "lucide-react";

interface Product {
  id: number;
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
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const handleContactSeller = () => {
    const message = `Hi ${product.seller.name}, I'm interested in your ${product.title} listed on Campus Mart for ₹${product.price}. Is it still available?`;
    const whatsappUrl = `https://wa.me/${product.seller.whatsapp.replace("+", "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-2">{product.title}</h3>
          <Badge variant="secondary" className="ml-2 shrink-0">
            {product.category}
          </Badge>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-green-600">
            ₹{product.price.toLocaleString()}
          </span>
          <Badge variant="outline">
            {product.condition}
          </Badge>
        </div>
        
        <div className="text-sm text-gray-500 space-y-1">
          <div className="flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            <span>Seller: {product.seller.name}</span>
          </div>
          <div>{formatTimeAgo(product.createdAt)}</div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleContactSeller}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Contact on WhatsApp
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
