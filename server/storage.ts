import {
  type User,
  type InsertUser,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type OrderWithItems,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByDiscordId(discordId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Order operations
  getOrders(): Promise<OrderWithItems[]>;
  getOrder(id: string): Promise<OrderWithItems | undefined>;
  getOrderByCode(orderCode: string): Promise<OrderWithItems | undefined>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<OrderWithItems>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  updateOrderPaymentLink(id: string, paymentLink: string): Promise<Order | undefined>;
}

function generateOrderCode(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `4e-${randomNum}`;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private orders: Map<string, Order>;
  private orderItems: Map<string, OrderItem>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();

    // Initialize with sample products
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const productImage = "https://placehold.co/400x400/7c3aed/ffffff?text=4E+Store";
    
    const sampleProducts: InsertProduct[] = [
      {
        name: "Premium Gaming Account",
        description: "High-level gaming account with exclusive skins and achievements",
        price: "49.99",
        category: "Accounts",
        imageUrl: productImage,
        inStock: 5,
      },
      {
        name: "Discord Nitro 1 Year",
        description: "Full year of Discord Nitro with all premium features",
        price: "99.99",
        category: "Subscriptions",
        imageUrl: productImage,
        inStock: 10,
      },
      {
        name: "Game Keys Bundle",
        description: "Collection of popular game activation keys",
        price: "79.99",
        category: "Game Keys",
        imageUrl: productImage,
        inStock: 15,
      },
      {
        name: "VIP Server Access",
        description: "Lifetime access to premium VIP gaming servers",
        price: "149.99",
        category: "Access",
        imageUrl: productImage,
        inStock: 3,
      },
      {
        name: "Custom Bot Development",
        description: "Professional Discord bot tailored to your needs",
        price: "199.99",
        category: "Services",
        imageUrl: productImage,
        inStock: 2,
      },
      {
        name: "Exclusive Emote Pack",
        description: "Unique animated emotes for your Discord server",
        price: "29.99",
        category: "Digital Goods",
        imageUrl: productImage,
        inStock: 20,
      },
      {
        name: "Rare Collectible NFT",
        description: "Limited edition digital collectible with blockchain verification",
        price: "299.99",
        category: "Digital Goods",
        imageUrl: productImage,
        inStock: 1,
      },
      {
        name: "Pro Streaming Setup Guide",
        description: "Complete guide to professional streaming setup and configuration",
        price: "39.99",
        category: "Guides",
        imageUrl: productImage,
        inStock: 50,
      },
    ];

    sampleProducts.forEach((product) => {
      const id = randomUUID();
      this.products.set(id, { ...product, id });
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByDiscordId(discordId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.discordId === discordId
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  // Order operations
  async getOrders(): Promise<OrderWithItems[]> {
    const orders = Array.from(this.orders.values());
    return orders.map((order) => ({
      ...order,
      items: Array.from(this.orderItems.values()).filter(
        (item) => item.orderId === order.id
      ),
    }));
  }

  async getOrder(id: string): Promise<OrderWithItems | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    return {
      ...order,
      items: Array.from(this.orderItems.values()).filter(
        (item) => item.orderId === order.id
      ),
    };
  }

  async getOrderByCode(orderCode: string): Promise<OrderWithItems | undefined> {
    const order = Array.from(this.orders.values()).find(
      (o) => o.orderCode === orderCode
    );
    if (!order) return undefined;

    return {
      ...order,
      items: Array.from(this.orderItems.values()).filter(
        (item) => item.orderId === order.id
      ),
    };
  }

  async createOrder(
    insertOrder: InsertOrder,
    items: InsertOrderItem[]
  ): Promise<OrderWithItems> {
    const id = randomUUID();
    const orderCode = generateOrderCode();
    const now = new Date();

    const order: Order = {
      ...insertOrder,
      id,
      orderCode,
      createdAt: now,
      updatedAt: now,
    };

    this.orders.set(id, order);

    const orderItemsCreated: OrderItem[] = [];
    for (const item of items) {
      const itemId = randomUUID();
      const orderItem: OrderItem = {
        ...item,
        id: itemId,
        orderId: id,
      };
      this.orderItems.set(itemId, orderItem);
      orderItemsCreated.push(orderItem);
    }

    return {
      ...order,
      items: orderItemsCreated,
    };
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const updated: Order = {
      ...order,
      status,
      updatedAt: new Date(),
    };

    this.orders.set(id, updated);
    return updated;
  }

  async updateOrderPaymentLink(id: string, paymentLink: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const updated: Order = {
      ...order,
      paymentLink,
      updatedAt: new Date(),
    };

    this.orders.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
