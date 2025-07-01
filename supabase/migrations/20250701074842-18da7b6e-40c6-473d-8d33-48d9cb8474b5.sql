
-- Add a sold column to the products table
ALTER TABLE public.products 
ADD COLUMN sold BOOLEAN NOT NULL DEFAULT false;

-- Add an index for better performance when filtering by sold status
CREATE INDEX idx_products_sold ON public.products(sold);
