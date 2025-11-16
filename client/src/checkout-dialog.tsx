import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiDiscord } from "react-icons/si";
import { CheckCircle2, ExternalLink } from "lucide-react";

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (discordUsername: string) => void;
  isPending: boolean;
  orderCode?: string;
  currentUser?: { discordUsername: string } | null;
}

export function CheckoutDialog({
  isOpen,
  onClose,
  onSubmit,
  isPending,
  orderCode,
  currentUser,
}: CheckoutDialogProps) {
  const [discordUsername, setDiscordUsername] = useState(currentUser?.discordUsername || "");
  const [step, setStep] = useState<"form" | "success">("form");

  // Switch to success step when orderCode becomes available
  useEffect(() => {
    if (orderCode && !isPending) {
      setStep("success");
    }
  }, [orderCode, isPending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discordUsername.trim()) return;
    onSubmit(discordUsername);
    // Don't change step here - wait for orderCode to be set
  };

  const handleClose = () => {
    setStep("form");
    setDiscordUsername(currentUser?.discordUsername || "");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md border-purple-500/20" data-testid="dialog-checkout">
        {step === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <SiDiscord className="h-5 w-5 text-purple-400" />
                Complete Your Order
              </DialogTitle>
              <DialogDescription>
                Enter your Discord username and join our server to complete your purchase.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="discord-username">Discord Username</Label>
                <Input
                  id="discord-username"
                  placeholder="YourUsername#0000"
                  value={discordUsername}
                  onChange={(e) => setDiscordUsername(e.target.value)}
                  required
                  disabled={isPending || !!currentUser}
                  className="border-purple-500/20 focus:border-purple-500"
                  data-testid="input-discord-username"
                />
                <p className="text-xs text-muted-foreground">
                  We'll send order updates via Discord DM
                </p>
              </div>

              <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4 space-y-3">
                <p className="text-sm font-medium flex items-center gap-2">
                  <SiDiscord className="h-4 w-4 text-purple-400" />
                  Join 4E Store Discord Server
                </p>
                <p className="text-xs text-muted-foreground">
                  Join our Discord server to receive real-time order updates and support.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 border-purple-500/30"
                  asChild
                  data-testid="button-join-discord"
                >
                  <a
                    href={`https://discord.gg/${import.meta.env.VITE_DISCORD_INVITE || 'invite'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Join Server
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-lg shadow-purple-500/30"
                disabled={isPending || !discordUsername.trim()}
                data-testid="button-place-order"
              >
                {isPending ? "Processing..." : "Place Order"}
              </Button>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-emerald-500/20 p-4">
                  <CheckCircle2 className="h-12 w-12 text-emerald-400" />
                </div>
              </div>
              <DialogTitle className="text-center">Order Placed Successfully!</DialogTitle>
              <DialogDescription className="text-center space-y-3">
                <p>Your order has been created with code:</p>
                <div
                  className="text-2xl font-mono font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent py-2"
                  data-testid="text-order-code-success"
                >
                  {orderCode}
                </div>
                <p className="text-sm">
                  You'll receive order updates and payment details via Discord DM.
                </p>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Button
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
                data-testid="button-close-success"
              >
                Continue Shopping
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = "/dashboard"}
                className="w-full"
                data-testid="button-view-orders"
              >
                View My Orders
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
