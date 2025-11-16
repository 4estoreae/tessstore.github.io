import {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  SlashCommandBuilder,
  REST,
  Routes,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import type { OrderWithItems } from "@shared/schema";
import { storage } from "./storage";

const OWNER_ID = process.env.DISCORD_OWNER_ID || "";
const CO_OWNER_ID = process.env.DISCORD_CO_OWNER_ID || "";
const LOGS_CHANNEL_ID = process.env.DISCORD_LOGS_CHANNEL_ID || "";
const SERVER_ID = process.env.DISCORD_SERVER_ID || "";

let client: Client | null = null;

function isOwnerOrCoOwner(userId: string): boolean {
  return userId === OWNER_ID || userId === CO_OWNER_ID;
}

function createOrderEmbed(order: OrderWithItems, title: string = "New Order") {
  const statusColors = {
    pending: 0xfbbf24,
    in_progress: 0x3b82f6,
    payment_pending: 0xf97316,
    completed: 0x10b981,
    cancelled: 0xef4444,
  };

  const color = statusColors[order.status as keyof typeof statusColors] || 0x8b5cf6;

  const itemsText = order.items
    .map((item) => `• ${item.productName} x${item.quantity} - $${parseFloat(item.productPrice).toFixed(2)}`)
    .join("\n");

  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(`**Order Code:** \`${order.orderCode}\``)
    .addFields(
      { name: "Customer", value: order.customerDiscordUsername, inline: true },
      { name: "Status", value: order.status.toUpperCase().replace(/_/g, " "), inline: true },
      { name: "Total", value: `$${parseFloat(order.totalAmount).toFixed(2)}`, inline: true },
      { name: "Items", value: itemsText || "No items" }
    )
    .setTimestamp()
    .setFooter({ text: "4E Store Order System" });
}

export async function initializeBot() {
  if (!process.env.DISCORD_BOT_TOKEN) {
    console.log("Discord bot token not found, skipping bot initialization");
    return;
  }

  client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.DirectMessages,
    ],
  });

  // Register slash commands
  const commands = [
    new SlashCommandBuilder()
      .setName("orders")
      .setDescription("View all pending orders")
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    new SlashCommandBuilder()
      .setName("status")
      .setDescription("Update order status")
      .addStringOption((option) =>
        option
          .setName("code")
          .setDescription("Order code (e.g., 4e-1234)")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("status")
          .setDescription("New status")
          .setRequired(true)
          .addChoices(
            { name: "Pending", value: "pending" },
            { name: "In Progress", value: "in_progress" },
            { name: "Payment Pending", value: "payment_pending" },
            { name: "Completed", value: "completed" },
            { name: "Cancelled", value: "cancelled" }
          )
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    new SlashCommandBuilder()
      .setName("payment")
      .setDescription("Send payment link to customer")
      .addStringOption((option) =>
        option
          .setName("code")
          .setDescription("Order code (e.g., 4e-1234)")
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("link")
          .setDescription("Payment link URL")
          .setRequired(true)
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    new SlashCommandBuilder()
      .setName("complete")
      .setDescription("Mark order as completed")
      .addStringOption((option) =>
        option
          .setName("code")
          .setDescription("Order code (e.g., 4e-1234)")
          .setRequired(true)
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    new SlashCommandBuilder()
      .setName("cancel")
      .setDescription("Cancel an order")
      .addStringOption((option) =>
        option
          .setName("code")
          .setDescription("Order code (e.g., 4e-1234)")
          .setRequired(true)
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    new SlashCommandBuilder()
      .setName("stats")
      .setDescription("View revenue and order statistics")
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    new SlashCommandBuilder()
      .setName("logs")
      .setDescription("View recent order activity")
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  ].map((command) => command.toJSON());

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_BOT_TOKEN);

  try {
    if (process.env.DISCORD_CLIENT_ID && SERVER_ID) {
      console.log("Registering Discord slash commands...");
      await rest.put(Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, SERVER_ID), {
        body: commands,
      });
      console.log("Discord slash commands registered successfully");
    } else {
      console.log("Discord client ID or server ID not configured, skipping command registration");
    }
  } catch (error) {
    console.error("Failed to register slash commands:", error);
  }

  client.on("ready", () => {
    console.log(`Discord bot logged in as ${client?.user?.tag}`);
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    await handleCommand(interaction);
  });

  try {
    await client.login(process.env.DISCORD_BOT_TOKEN);
  } catch (error) {
    console.error("Failed to start Discord bot:", error);
  }
}

async function handleCommand(interaction: ChatInputCommandInteraction) {
  if (!isOwnerOrCoOwner(interaction.user.id)) {
    return interaction.reply({
      content: "❌ You don't have permission to use this command.",
      ephemeral: true,
    });
  }

  try {
    switch (interaction.commandName) {
      case "orders": {
        const orders = await storage.getOrders();
        const pending = orders.filter((o) => o.status === "pending" || o.status === "in_progress");

        if (pending.length === 0) {
          return interaction.reply({
            content: "📦 No pending orders",
            ephemeral: true,
          });
        }

        const embeds = pending.slice(0, 10).map((order) => createOrderEmbed(order, "Pending Order"));
        await interaction.reply({ embeds, ephemeral: true });
        break;
      }

      case "status": {
        const code = interaction.options.getString("code", true);
        const status = interaction.options.getString("status", true);
        const order = await storage.getOrderByCode(code);

        if (!order) {
          return interaction.reply({
            content: `❌ Order ${code} not found`,
            ephemeral: true,
          });
        }

        await storage.updateOrderStatus(order.id, status);
        await sendStatusUpdate(order, status);

        const embed = createOrderEmbed({ ...order, status }, "Order Status Updated");
        await interaction.reply({ embeds: [embed], ephemeral: true });
        break;
      }

      case "payment": {
        const code = interaction.options.getString("code", true);
        const link = interaction.options.getString("link", true);
        const order = await storage.getOrderByCode(code);

        if (!order) {
          return interaction.reply({
            content: `❌ Order ${code} not found`,
            ephemeral: true,
          });
        }

        await storage.updateOrderPaymentLink(order.id, link);
        await sendPaymentLink(order, link);

        await interaction.reply({
          content: `✅ Payment link sent to customer for order ${code}`,
          ephemeral: true,
        });
        break;
      }

      case "complete": {
        const code = interaction.options.getString("code", true);
        const order = await storage.getOrderByCode(code);

        if (!order) {
          return interaction.reply({
            content: `❌ Order ${code} not found`,
            ephemeral: true,
          });
        }

        await storage.updateOrderStatus(order.id, "completed");
        await sendStatusUpdate(order, "completed");

        await interaction.reply({
          content: `✅ Order ${code} marked as completed`,
          ephemeral: true,
        });
        break;
      }

      case "cancel": {
        const code = interaction.options.getString("code", true);
        const order = await storage.getOrderByCode(code);

        if (!order) {
          return interaction.reply({
            content: `❌ Order ${code} not found`,
            ephemeral: true,
          });
        }

        await storage.updateOrderStatus(order.id, "cancelled");
        await sendStatusUpdate(order, "cancelled");

        await interaction.reply({
          content: `✅ Order ${code} cancelled`,
          ephemeral: true,
        });
        break;
      }

      case "stats": {
        const orders = await storage.getOrders();
        const totalRevenue = orders
          .filter((o) => o.status === "completed")
          .reduce((sum, o) => sum + parseFloat(o.totalAmount), 0);

        const embed = new EmbedBuilder()
          .setColor(0x8b5cf6)
          .setTitle("📊 Revenue Statistics")
          .addFields(
            { name: "Total Orders", value: orders.length.toString(), inline: true },
            { name: "Completed", value: orders.filter((o) => o.status === "completed").length.toString(), inline: true },
            { name: "Pending", value: orders.filter((o) => o.status === "pending" || o.status === "in_progress").length.toString(), inline: true },
            { name: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, inline: false }
          )
          .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
        break;
      }

      case "logs": {
        const orders = await storage.getOrders();
        const recent = orders.slice(-5).reverse();

        if (recent.length === 0) {
          return interaction.reply({
            content: "📝 No order history",
            ephemeral: true,
          });
        }

        const embeds = recent.map((order) => createOrderEmbed(order, "Recent Order"));
        await interaction.reply({ embeds, ephemeral: true });
        break;
      }
    }
  } catch (error) {
    console.error("Command error:", error);
    await interaction.reply({
      content: "❌ An error occurred while processing the command",
      ephemeral: true,
    });
  }
}

export async function sendOrderNotification(order: OrderWithItems) {
  if (!client || !client.isReady()) return;

  const embed = createOrderEmbed(order, "🆕 New Order Received");

  // Send to owner and co-owner
  for (const userId of [OWNER_ID, CO_OWNER_ID].filter(Boolean)) {
    try {
      const user = await client.users.fetch(userId);
      await user.send({ embeds: [embed] });
    } catch (error) {
      console.error(`Failed to send DM to ${userId}:`, error);
    }
  }

  // Send to logs channel
  if (LOGS_CHANNEL_ID) {
    try {
      const channel = await client.channels.fetch(LOGS_CHANNEL_ID);
      if (channel?.isTextBased()) {
        await channel.send({ embeds: [embed] });
      }
    } catch (error) {
      console.error("Failed to send to logs channel:", error);
    }
  }
}

export async function sendStatusUpdate(order: OrderWithItems, status: string) {
  if (!client || !client.isReady()) return;

  const statusMessages = {
    pending: "⏳ Your order is pending review",
    in_progress: "🔄 Your order is being processed",
    payment_pending: "💳 Payment is required to complete your order",
    completed: "✅ Your order has been completed!",
    cancelled: "❌ Your order has been cancelled",
  };

  const message = statusMessages[status as keyof typeof statusMessages] || "Order status updated";

  const embed = createOrderEmbed(order, message);

  // Send to logs channel
  if (LOGS_CHANNEL_ID) {
    try {
      const channel = await client.channels.fetch(LOGS_CHANNEL_ID);
      if (channel?.isTextBased()) {
        await channel.send({ embeds: [embed] });
      }
    } catch (error) {
      console.error("Failed to send to logs channel:", error);
    }
  }

  // Note: In production, you'd need the customer's Discord ID to send them a DM
  // For now, we're just logging to the channel
}

export async function sendPaymentLink(order: OrderWithItems, paymentLink: string) {
  if (!client || !client.isReady()) return;

  const embed = new EmbedBuilder()
    .setColor(0xf97316)
    .setTitle("💳 Payment Required")
    .setDescription(`**Order Code:** \`${order.orderCode}\`\n\nPlease complete your payment using the link below:`)
    .addFields(
      { name: "Total Amount", value: `$${parseFloat(order.totalAmount).toFixed(2)}`, inline: true },
      { name: "Payment Link", value: `[Click here to pay](${paymentLink})`, inline: false }
    )
    .setTimestamp()
    .setFooter({ text: "4E Store Payment System" });

  // Send to logs channel
  if (LOGS_CHANNEL_ID) {
    try {
      const channel = await client.channels.fetch(LOGS_CHANNEL_ID);
      if (channel?.isTextBased()) {
        await channel.send({ embeds: [embed] });
      }
    } catch (error) {
      console.error("Failed to send to logs channel:", error);
    }
  }
}
