import { X, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { CartItem } from "@shared/schema";

interface CartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export function CartOverlay({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartOverlayProps) {
  const total = items.reduce(
    (sum, item) => sum + parseFloat(item.productPrice) * item.quantity,
    0
  );

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
        onClick={onClose}
        data-testid="overlay-cart-backdrop"
      />
      <div
        className="fixed right-0 top-0 h-full w-full sm:w-96 bg-card border-l border-purple-500/20 shadow-2xl shadow-purple-500/20 z-50 flex flex-col"
        data-testid="overlay-cart"
      >
        <CardHeader className="border-b border-purple-500/20 flex flex-row items-center justify-between space-y-0 p-6">
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-purple-400" />
            Shopping Cart
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-testid="button-close-cart"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
              <div className="space-y-2">
                <p className="font-medium text-muted-foreground" data-testid="text-empty-cart">
                  Your cart is empty
                </p>
                <p className="text-sm text-muted-foreground">
                  Add some products to get started
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <Card
                  key={item.productId}
                  className="border-purple-500/20"
                  data-testid={`cart-item-${item.productId}`}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-20 h-20 object-cover rounded-md border border-purple-500/20"
                        data-testid={`img-cart-item-${item.productId}`}
                      />
                      <div className="flex-1 space-y-2">
                        <h4 className="font-medium text-sm line-clamp-1" data-testid={`text-cart-item-name-${item.productId}`}>
                          {item.productName}
                        </h4>
                        <p className="text-sm text-purple-400 font-semibold" data-testid={`text-cart-item-price-${item.productId}`}>
                          ${parseFloat(item.productPrice).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() =>
                              onUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))
                            }
                            data-testid={`button-decrease-quantity-${item.productId}`}
                          >
                            -
                          </Button>
                          <Badge variant="secondary" data-testid={`text-cart-item-quantity-${item.productId}`}>
                            {item.quantity}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                            data-testid={`button-increase-quantity-${item.productId}`}
                          >
                            +
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 ml-auto text-destructive"
                            onClick={() => onRemoveItem(item.productId)}
                            data-testid={`button-remove-item-${item.productId}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>

        {items.length > 0 && (
          <CardFooter className="border-t border-purple-500/20 p-6 flex-col gap-4">
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span data-testid="text-cart-subtotal">${total.toFixed(2)}</span>
              </div>
              <Separator className="bg-purple-500/20" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent" data-testid="text-cart-total">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
            <Button
              onClick={onCheckout}
              className="w-full gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-lg shadow-purple-500/30"
              data-testid="button-checkout"
            >
              Proceed to Checkout
            </Button>
          </CardFooter>
        )}
      </div>
    </>
  );
}
