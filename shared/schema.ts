import { pgTable, text, serial, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Gallery items for the barbershop
export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const galleryItemsInsertSchema = createInsertSchema(galleryItems, {
  title: (schema) => schema.min(2, "Title must be at least 2 characters"),
  description: (schema) => schema.min(5, "Description must be at least 5 characters"),
  imageUrl: (schema) => schema.url("Image URL must be a valid URL"),
  category: (schema) => schema.min(2, "Category must be at least 2 characters"),
});

export const galleryItemsSelectSchema = createSelectSchema(galleryItems);
export type GalleryItem = typeof galleryItems.$inferSelect;
export type InsertGalleryItem = z.infer<typeof galleryItemsInsertSchema>;

// Blog posts for the barbershop
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  imageAlt: text("image_alt").notNull(),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
});

export const blogPostsInsertSchema = createInsertSchema(blogPosts, {
  title: (schema) => schema.min(5, "Title must be at least 5 characters"),
  excerpt: (schema) => schema.min(10, "Excerpt must be at least 10 characters"),
  content: (schema) => schema.min(50, "Content must be at least 50 characters"),
  imageUrl: (schema) => schema.url("Image URL must be a valid URL"),
  imageAlt: (schema) => schema.min(5, "Image alt text must be at least 5 characters"),
});

export const blogPostsSelectSchema = createSelectSchema(blogPosts);
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof blogPostsInsertSchema>;

// Newsletter subscribers
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
});

export const subscribersInsertSchema = createInsertSchema(subscribers, {
  email: (schema) => schema.email("Must provide a valid email"),
});

export const subscribersSelectSchema = createSelectSchema(subscribers);
export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = z.infer<typeof subscribersInsertSchema>;

// Services offered by the barbershop
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(),
  imageUrl: text("image_url").notNull(),
  imageAlt: text("image_alt").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const servicesInsertSchema = createInsertSchema(services, {
  title: (schema) => schema.min(2, "Title must be at least 2 characters"),
  description: (schema) => schema.min(10, "Description must be at least 10 characters"),
  price: (schema) => schema.min(2, "Price must be at least 2 characters"),
  imageUrl: (schema) => schema.url("Image URL must be a valid URL"),
  imageAlt: (schema) => schema.min(5, "Image alt text must be at least 5 characters"),
});

export const servicesSelectSchema = createSelectSchema(services);
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof servicesInsertSchema>;

// Screen advertising enums
export const packageTypeEnum = pgEnum("package_type", ["bring-your-own", "image-package", "video-package"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "paid", "completed", "cancelled"]);

// Screen advertising orders
export const screenAdvertisingOrders = pgTable("screen_advertising_orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  businessName: text("business_name").notNull(),
  packageType: packageTypeEnum("package_type").notNull(),
  amount: integer("amount").notNull(), // 50, 70, or 100
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeSessionId: text("stripe_session_id").unique(),
  uploadedFileStorageKey: text("uploaded_file_storage_key"), // S3/storage key for bring-your-own package
  uploadedFileName: text("uploaded_file_name"), // Original filename
  status: orderStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const screenAdvertisingOrdersInsertSchema = createInsertSchema(screenAdvertisingOrders, {
  customerName: (schema) => schema.min(2, "Name must be at least 2 characters"),
  customerEmail: (schema) => schema.email("Must provide a valid email"),
  businessName: (schema) => schema.min(2, "Business name must be at least 2 characters"),
  amount: (schema) => schema.min(50, "Amount must be at least 50").max(100, "Amount must not exceed 100"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const screenAdvertisingOrdersSelectSchema = createSelectSchema(screenAdvertisingOrders);
export type ScreenAdvertisingOrder = typeof screenAdvertisingOrders.$inferSelect;
export type InsertScreenAdvertisingOrder = z.infer<typeof screenAdvertisingOrdersInsertSchema>;

// Memory game scores for leaderboard
export const discountTierEnum = pgEnum("discount_tier", ["premium", "standard"]);

export const memoryGameScores = pgTable("memory_game_scores", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  moves: integer("moves").notNull(),
  discountTier: discountTierEnum("discount_tier").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const memoryGameScoresInsertSchema = createInsertSchema(memoryGameScores, {
  playerName: (schema) => schema.min(2, "Name must be at least 2 characters"),
  email: (schema) => schema.email("Must provide a valid email"),
  moves: (schema) => schema.min(1, "Moves must be at least 1"),
}).omit({
  id: true,
  createdAt: true,
});

export const memoryGameScoresSelectSchema = createSelectSchema(memoryGameScores);
export type MemoryGameScore = typeof memoryGameScores.$inferSelect;
export type InsertMemoryGameScore = z.infer<typeof memoryGameScoresInsertSchema>;
