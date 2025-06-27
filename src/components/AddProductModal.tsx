
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCampus: string;
  onProductAdded: () => void;
}

const AddProductModal = ({ isOpen, onClose, userCampus, onProductAdded }: AddProductModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    whatsapp: "",
    sellerName: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const categories = ["Textbooks", "Notes", "Electronics", "Stationery", "Miscellaneous"];
  const conditions = ["Excellent", "Good", "Fair"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate WhatsApp number
    const whatsappRegex = /^\+?[1-9]\d{1,14}$/;
    if (!whatsappRegex.test(formData.whatsapp.replace(/\s/g, ""))) {
      toast({
        title: "Invalid WhatsApp Number",
        description: "Please enter a valid WhatsApp number",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Insert product into Supabase
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
            category: formData.category,
            condition: formData.condition,
            seller_name: formData.sellerName,
            whatsapp_number: formData.whatsapp,
            campus: userCampus.replace(".", "-").toLowerCase(),
            image_url: "/placeholder.svg" // Default placeholder image
          }
        ])
        .select();

      if (error) {
        console.error('Error inserting product:', error);
        toast({
          title: "Error",
          description: "Failed to list your item. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Product Listed Successfully!",
          description: "Your item has been listed on Campus Mart and is now visible to other students.",
        });

        // Reset form
        setFormData({
          title: "",
          description: "",
          price: "",
          category: "",
          condition: "",
          whatsapp: "",
          sellerName: ""
        });

        // Notify parent component to refresh products
        onProductAdded();
        onClose();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sell Your Item</DialogTitle>
          <DialogDescription>
            List your item for students in your campus to discover and contact you
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Product Title*</Label>
              <Input
                id="title"
                placeholder="e.g., Engineering Mathematics Textbook"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="price">Price (₹)*</Label>
              <Input
                id="price"
                type="number"
                placeholder="e.g., 800"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description*</Label>
            <Textarea
              id="description"
              placeholder="Describe your item's condition, features, and any relevant details..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              required
              className="min-h-[100px]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category*</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="condition">Condition*</Label>
              <Select value={formData.condition} onValueChange={(value) => handleChange("condition", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map((condition) => (
                    <SelectItem key={condition} value={condition}>
                      {condition}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sellerName">Your Name*</Label>
              <Input
                id="sellerName"
                placeholder="e.g., Rahul Kumar"
                value={formData.sellerName}
                onChange={(e) => handleChange("sellerName", e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="whatsapp">WhatsApp Number*</Label>
              <Input
                id="whatsapp"
                placeholder="e.g., +919876543210"
                value={formData.whatsapp}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Include country code (e.g., +91 for India)
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Campus:</strong> {userCampus.split(".")[0].toUpperCase().replace("-", " ")}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Only students from your campus will be able to see and contact you about this item.
            </p>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Listing..." : "List Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
