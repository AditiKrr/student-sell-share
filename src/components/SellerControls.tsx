
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Settings } from "lucide-react";

interface SellerControlsProps {
  productId: string;
  currentSoldStatus: boolean;
  onStatusUpdate: (newStatus: boolean) => void;
}

const SellerControls = ({ productId, currentSoldStatus, onStatusUpdate }: SellerControlsProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleSoldStatusChange = async (newStatus: boolean) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({ sold: newStatus })
        .eq('id', productId);

      if (error) {
        console.error('Error updating sold status:', error);
        toast({
          title: "Error",
          description: "Failed to update item status. Please try again.",
          variant: "destructive",
        });
      } else {
        onStatusUpdate(newStatus);
        toast({
          title: "Success",
          description: `Item marked as ${newStatus ? 'sold' : 'available'}.`,
        });
      }
    } catch (error) {
      console.error('Unexpected error updating sold status:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
      <div className="flex items-center space-x-2 mb-2">
        <Settings className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-800">Seller Controls</span>
      </div>
      <div className="flex items-center space-x-3">
        <Switch
          id="sold-status"
          checked={currentSoldStatus}
          onCheckedChange={handleSoldStatusChange}
          disabled={isUpdating}
        />
        <Label htmlFor="sold-status" className="text-sm text-blue-700">
          {currentSoldStatus ? 'Mark as Available' : 'Mark as Sold'}
        </Label>
      </div>
    </div>
  );
};

export default SellerControls;
