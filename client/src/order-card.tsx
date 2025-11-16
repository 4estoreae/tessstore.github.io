import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, Package, CreditCard, CheckCircle, XCircle } from "lucide-react";
import type { OrderWithItems } from "@shared/schema";
import { format } from "date-fns";

interface OrderCardProps {
  order: OrderWithItems;
}

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  in_progress: {
    label: "In Progress",
    icon: Package,
    className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  payment_pending: {
    label: "Payment Pending",
    icon: CreditCard,
    className: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle,
    className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    className: "bg-red-500/20 text-red-400 border-red-500/30",
  },
};

export function OrderCard({ order }: OrderCardProps) {
  const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <Card
      className="border-purple-500/20 hover:border-purple-500/40 transition-all hover:shadow-lg hover:shadow-purple-500/10"
      data-testid={`card-order-${order.id}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-lg font-mono">
              <span className="text-muted-foreground text-sm font-normal">Order</span>{" "}
              <span
                className="text-purple-400 shadow-sm shadow-purple-500/30"
                data-testid={`text-order-code-${order.id}`}
              >
                {order.orderCode}
              </span>
            </CardTitle>
            <p className="text-sm text-muted-foreground" data-testid={`text-order-date-${order.id}`}>
              {format(new Date(order.createdAt), "PPP 'at' p")}
            </p>
          </div>
          <Badge
            variant="outline"
            className={status.className}
            data-testid={`badge-order-status-${order.id}`}
          >
            <StatusIcon className="h-3 w-3 mr-1" />
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Items</p>
          {order.items.map((item, index) => (
            <div
              key={item.id}
              className="flex justify-between text-sm"
              data-testid={`order-item-${order.id}-${index}`}
            >
              <span>
                {item.productName} <span className="text-muted-foreground">x{item.quantity}</span>
              </span>
              <span className="font-medium">${parseFloat(item.productPrice).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <Separator className="bg-purple-500/20" />
        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span
            className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent"
            data-testid={`text-order-total-${order.id}`}
          >
            ${parseFloat(order.totalAmount).toFixed(2)}
          </span>
        </div>
        {order.paymentLink && (
          <div className="pt-2">
            <a
              href={order.paymentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-purple-400 hover:text-purple-300 underline underline-offset-4"
              data-testid={`link-payment-${order.id}`}
            >
              Payment Link Available →
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
