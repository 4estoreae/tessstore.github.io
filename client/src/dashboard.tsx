import { useQuery } from "@tanstack/react-query";
import { OrderCard } from "@/components/order-card";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Package, Clock, CheckCircle } from "lucide-react";
import type { OrderWithItems } from "@shared/schema";

interface DashboardPageProps {
  user: { discordUsername: string; discordAvatar?: string } | null;
}

export default function DashboardPage({ user }: DashboardPageProps) {
  const { data: orders, isLoading } = useQuery<OrderWithItems[]>({
    queryKey: ["/api/orders"],
  });

  const stats = {
    total: orders?.length || 0,
    pending: orders?.filter((o) => o.status === "pending" || o.status === "in_progress").length || 0,
    completed: orders?.filter((o) => o.status === "completed").length || 0,
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6 space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold" data-testid="text-page-title">
            My Orders
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your orders and view purchase history
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-purple-500/20" data-testid="card-user-info">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 ring-2 ring-purple-500/30">
                  <AvatarImage src={user?.discordAvatar} alt={user?.discordUsername || "User"} />
                  <AvatarFallback className="bg-purple-500/20 text-purple-400 text-xl">
                    {user?.discordUsername?.slice(0, 2).toUpperCase() || "??"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg" data-testid="text-user-name">
                    {user?.discordUsername || "Guest"}
                  </h3>
                  <p className="text-sm text-muted-foreground">Discord Member</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-4">
            <Card className="border-purple-500/20" data-testid="card-stat-total">
              <CardContent className="p-6 text-center space-y-2">
                <Package className="h-8 w-8 mx-auto text-purple-400" />
                <p className="text-3xl font-bold" data-testid="text-stat-total">
                  {stats.total}
                </p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </CardContent>
            </Card>
            <Card className="border-purple-500/20" data-testid="card-stat-pending">
              <CardContent className="p-6 text-center space-y-2">
                <Clock className="h-8 w-8 mx-auto text-amber-400" />
                <p className="text-3xl font-bold" data-testid="text-stat-pending">
                  {stats.pending}
                </p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </CardContent>
            </Card>
            <Card className="border-purple-500/20" data-testid="card-stat-completed">
              <CardContent className="p-6 text-center space-y-2">
                <CheckCircle className="h-8 w-8 mx-auto text-emerald-400" />
                <p className="text-3xl font-bold" data-testid="text-stat-completed">
                  {stats.completed}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Order History</h2>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-48 rounded-xl bg-purple-500/5 animate-pulse border border-purple-500/20"
                />
              ))}
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-4" data-testid="list-orders">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <Card className="border-purple-500/20">
              <CardContent className="p-12 text-center space-y-4">
                <Package className="h-16 w-16 mx-auto text-muted-foreground/50" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-muted-foreground" data-testid="text-no-orders">
                    No orders yet
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your order history will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
