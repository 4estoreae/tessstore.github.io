import { ShoppingCart, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SiDiscord } from "react-icons/si";

interface HeaderProps {
  user: { discordUsername: string; discordAvatar?: string } | null;
  cartItemCount: number;
  onCartClick: () => void;
  onLoginClick: () => void;
  onLogout: () => void;
}

export function Header({ user, cartItemCount, onCartClick, onLoginClick, onLogout }: HeaderProps) {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-500/20 backdrop-blur-lg bg-background/80">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 hover-elevate active-elevate-2 rounded-lg px-3 py-2 -ml-3">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-purple-500 bg-clip-text text-transparent font-mono">
              4E Store
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/">
              <button
                data-testid="link-home"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === "/" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Home
              </button>
            </Link>
            <Link href="/products">
              <button
                data-testid="link-products"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === "/products" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Products
              </button>
            </Link>
            {user && (
              <Link href="/dashboard">
                <button
                  data-testid="link-dashboard"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === "/dashboard" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  My Orders
                </button>
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onCartClick}
              className="relative"
              data-testid="button-cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full shadow-lg shadow-purple-500/50"
                  data-testid="badge-cart-count"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {user ? (
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 ring-2 ring-purple-500/30" data-testid="avatar-user">
                  <AvatarImage src={user.discordAvatar} alt={user.discordUsername} />
                  <AvatarFallback className="bg-purple-500/20 text-purple-400">
                    {user.discordUsername.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium" data-testid="text-username">
                  {user.discordUsername}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  data-testid="button-logout"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                onClick={onLoginClick}
                className="gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-lg shadow-purple-500/30"
                data-testid="button-login"
              >
                <SiDiscord className="h-4 w-4" />
                <span className="hidden sm:inline">Login with Discord</span>
                <span className="sm:hidden">Login</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
