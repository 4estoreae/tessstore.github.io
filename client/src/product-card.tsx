import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const inStock = parseInt(product.inStock?.toString() || "0") > 0;

  return (
    <Card
      className="group overflow-hidden border border-purple-500/20 hover:border-purple-500/40 transition-all hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1"
      data-testid={`card-product-${product.id}`}
    >
      <CardContent className="p-0">
        <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-purple-900/20 to-violet-900/20">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            data-testid={`img-product-${product.id}`}
          />
          {!inStock && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <Badge variant="secondary" className="text-sm">
                Out of Stock
              </Badge>
            </div>
          )}
          <Badge
            variant="secondary"
            className="absolute top-3 right-3 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30"
            data-testid={`badge-category-${product.id}`}
          >
            {product.category}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 p-6">
        <div className="w-full space-y-2">
          <h3
            className="font-semibold text-lg line-clamp-1"
            data-testid={`text-product-name-${product.id}`}
          >
            {product.name}
          </h3>
          <p
            className="text-sm text-muted-foreground line-clamp-2"
            data-testid={`text-product-description-${product.id}`}
          >
            {product.description}
          </p>
        </div>
        <div className="flex items-center justify-between w-full gap-3">
          <div
            className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent"
            data-testid={`text-product-price-${product.id}`}
          >
            ${parseFloat(product.price).toFixed(2)}
          </div>
          <Button
            onClick={() => onAddToCart(product)}
            disabled={!inStock}
            className="gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-lg shadow-purple-500/30"
            data-testid={`button-add-to-cart-${product.id}`}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
