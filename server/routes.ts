import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertProductSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Create product (admin only - no auth for MVP)
  app.post("/api/products", async (req, res) => {
    try {
      const validated = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validated);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  // Get all orders (in production, filter by user)
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Get single order
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  // Get order by code
  app.get("/api/orders/code/:code", async (req, res) => {
    try {
      const order = await storage.getOrderByCode(req.params.code);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  // Create order
  app.post("/api/orders", async (req, res) => {
    try {
      const { items, ...orderData } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Order must contain items" });
      }

      const validated = insertOrderSchema.parse(orderData);
      const order = await storage.createOrder(validated, items);

      // Send Discord notification
      try {
        const { sendOrderNotification } = await import("./discord-bot");
        await sendOrderNotification(order);
      } catch (discordError) {
        console.error("Discord notification failed:", discordError);
        // Don't fail the order creation if Discord fails
      }

      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Order creation error:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  // Update order status
  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }

      const order = await storage.updateOrderStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Send Discord notification
      try {
        const { sendStatusUpdate } = await import("./discord-bot");
        const fullOrder = await storage.getOrder(req.params.id);
        if (fullOrder) {
          await sendStatusUpdate(fullOrder, status);
        }
      } catch (discordError) {
        console.error("Discord notification failed:", discordError);
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  // Update order payment link
  app.patch("/api/orders/:id/payment", async (req, res) => {
    try {
      const { paymentLink } = req.body;
      if (!paymentLink) {
        return res.status(400).json({ error: "Payment link is required" });
      }

      const order = await storage.updateOrderPaymentLink(req.params.id, paymentLink);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Send Discord notification
      try {
        const { sendPaymentLink } = await import("./discord-bot");
        const fullOrder = await storage.getOrder(req.params.id);
        if (fullOrder) {
          await sendPaymentLink(fullOrder, paymentLink);
        }
      } catch (discordError) {
        console.error("Discord notification failed:", discordError);
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update payment link" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
