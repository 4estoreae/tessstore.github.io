import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/header";
import { CartOverlay } from "@/components/cart-overlay";
import { CheckoutDialog } from "@/components/checkout-dialog";
import Home from "@/pages/home";
import ProductsPage from "@/pages/products";
import DashboardPage from "@/pages/dashboard";
import NotFound from "@/pages/not-found";
import type { Product, CartItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

function Router() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<{ discordUsername: string; discordAvatar?: string; discordId?: string } | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderCode, setOrderCode] = useState<string>();

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const createOrderMutation = useMutation({
    mutationFn: async (discordUsername: string) => {
      const orderData = {
        customerDiscordUsername: discordUsername,
        customerDiscordId: user?.discordId,
        userId: user ? "temp-user-id" : null,
        status: "pending",
        totalAmount: cart.reduce((sum, item) => sum + parseFloat(item.productPrice) * item.quantity, 0).toString(),
        items: cart.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          productPrice: item.productPrice,
          quantity: item.quantity,
        })),
      };
      
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: (data) => {
      setOrderCode(data.orderCode);
      setCart([]);
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Order placed!",
        description: `Your order ${data.orderCode} has been created successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Order failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          productPrice: product.price,
          quantity: 1,
          imageUrl: product.imageUrl,
        },
      ];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handlePlaceOrder = (discordUsername: string) => {
    createOrderMutation.mutate(discordUsername);
  };

  const handleLogin = () => {
    const mockUser = {
      discordUsername: "User#" + Math.floor(Math.random() * 9999),
      discordAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
      discordId: "mock-" + Date.now(),
    };
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
    toast({
      title: "Logged in",
      description: `Welcome, ${mockUser.discordUsername}!`,
    });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setLocation("/");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <>
      <Header
        user={user}
        cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onLoginClick={handleLogin}
        onLogout={handleLogout}
      />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/products">
          <ProductsPage onAddToCart={handleAddToCart} />
        </Route>
        <Route path="/dashboard">
          {user ? (
            <DashboardPage user={user} />
          ) : (
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center space-y-4">
                <p className="text-lg text-muted-foreground">Please login to view your orders</p>
              </div>
            </div>
          )}
        </Route>
        <Route component={NotFound} />
      </Switch>
      <CartOverlay
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />
      <CheckoutDialog
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setOrderCode(undefined);
        }}
        onSubmit={handlePlaceOrder}
        isPending={createOrderMutation.isPending}
        orderCode={orderCode}
        currentUser={user}
      />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
