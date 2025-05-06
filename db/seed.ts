import { db } from "./index";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  try {
    console.log("Starting database seeding...");

    // Seed services
    console.log("Seeding services...");
    const existingServices = await db.query.services.findMany();
    
    if (existingServices.length === 0) {
      console.log("No existing services found, creating new ones");
      
      const services = [
        {
          title: "CLASSIC CUTS",
          description: "Precision haircuts tailored to your face shape and personal style.",
          price: "From $25",
          imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
          imageAlt: "Classic Haircut"
        },
        {
          title: "BEARD GROOMING",
          description: "Expert beard trims and shaping for the perfect facial hair style.",
          price: "From $15",
          imageUrl: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500",
          imageAlt: "Beard Trim"
        },
        {
          title: "KIDS CUTS",
          description: "Gentle and patient service for our youngest clients.",
          price: "From $20",
          imageUrl: "https://pixabay.com/get/g351674fffbac96db93f94cd2ee8f0521c741c44c6b825a143e4552d04bfdd1752fe048511431d84249b67250901abcab7e1d8ce0df2772b403dbd0442ff09b19_1280.jpg",
          imageAlt: "Kids Haircut"
        }
      ];

      await db.insert(schema.services).values(services);
      console.log(`Inserted ${services.length} services`);
    } else {
      console.log(`Found ${existingServices.length} existing services, skipping`);
    }

    // Seed gallery items
    console.log("Seeding gallery items...");
    const existingGalleryItems = await db.query.galleryItems.findMany();
    
    if (existingGalleryItems.length === 0) {
      console.log("No existing gallery items found, creating new ones");
      
      const galleryItems = [
        {
          title: "Modern Fade",
          description: "Precision fade with textured top styling",
          imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600",
          category: "fades"
        },
        {
          title: "Sculpted Beard",
          description: "Precision trimmed beard with defined lines",
          imageUrl: "https://pixabay.com/get/g81b3c4bd96a09491a63817865acf55c8dd1f1ca5f95d4b318c4709e48c8109a28394f856cc916377a2da53e110db54a2120e7e118e0aecde48a68fcca579cb02_1280.jpg",
          category: "beards"
        },
        {
          title: "Kids Style",
          description: "Fun and age-appropriate haircut for young clients",
          imageUrl: "https://pixabay.com/get/gd20f0a7ddf7d6c3cc61b8cdb042f9b8e389f1b2bedd4bcba28c7e11f64367b69cebec8e6a155ee8096652268ca84cdef354a7c4b399ddbf1880359c89821a388_1280.jpg",
          category: "kids"
        },
        {
          title: "Skin Fade",
          description: "Clean skin fade with classic side part",
          imageUrl: "https://pixabay.com/get/ga4dc50fc18819b3f47b8a618746f924add151511450557f011ca3371cc42d68a1c9db9668b6599175b856dfffd9cd1f78a6a2f8aef4d6504da1f17c748757e35_1280.jpg",
          category: "fades"
        },
        {
          title: "Full Beard",
          description: "Shaped and conditioned full beard style",
          imageUrl: "https://images.unsplash.com/photo-1595152452543-e5fc28ebc2b8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600",
          category: "beards"
        },
        {
          title: "Trendy Kids Cut",
          description: "Modern style tailored for younger clients",
          imageUrl: "https://pixabay.com/get/gb6db38c65baa6a7b4a31fc8b4ca43a8b09d09b677594e49d1c6dfd3c6d258f97ccbd4a5cabc38d4dfebb2e0ae5260cfbcf834cb21000be2f6daeea64fd2e1b8d_1280.jpg",
          category: "kids"
        }
      ];

      await db.insert(schema.galleryItems).values(galleryItems);
      console.log(`Inserted ${galleryItems.length} gallery items`);
    } else {
      console.log(`Found ${existingGalleryItems.length} existing gallery items, skipping`);
    }

    // Seed blog posts
    console.log("Seeding blog posts...");
    const existingBlogPosts = await db.query.blogPosts.findMany();
    
    if (existingBlogPosts.length === 0) {
      console.log("No existing blog posts found, creating new ones");
      
      const blogPosts = [
        {
          title: "5 TRENDING HAIRCUTS FOR 2023",
          excerpt: "Discover the most popular men's haircut styles that are dominating this year.",
          content: "This year, men's hairstyles are all about versatility and low-maintenance styles that still look sharp. The top trending cuts include the textured crop, modern mullet, classic buzz cut with personalized details, mid-length styles with natural texture, and the ever-popular skin fade with various top styles. Each of these cuts offers a unique way to express your personality while keeping your look fresh and current.",
          imageUrl: "https://pixabay.com/get/g0e68d5a6714a96e00da847cf48be40928be3df140579707557d9fca3c7a8e1fe9ae6e77e2880e1f2c6cc77d13a45a9c0f93f430306c790c44d59fe53429855a0_1280.jpg",
          imageAlt: "Haircut Styles"
        },
        {
          title: "ULTIMATE BEARD CARE GUIDE",
          excerpt: "Essential tips and products for maintaining a healthy, well-groomed beard.",
          content: "Proper beard care begins with understanding your facial hair type and skin needs. Start with a quality beard wash and conditioner to keep your facial hair clean and soft. Daily beard oil application helps moisturize both the hair and skin underneath, preventing itchiness and beardruff. Use a boar bristle brush to distribute oil and train your beard hairs. Trim regularly to maintain your desired shape, and consider beard balm for added styling control and moisture retention. For the best results, establish a daily beard care routine and stick to it consistently.",
          imageUrl: "https://pixabay.com/get/g1b52dcc17b098484c58ce40d21e5e862e474db50ed8673b0af6aee703b2c12064e11616768d2b980f7d4292b09a80d0e36f6e0a437048657b977e40bdc1b1634_1280.jpg",
          imageAlt: "Beard Care"
        },
        {
          title: "10 YEARS OF ROYALS: OUR STORY",
          excerpt: "Looking back at a decade of exceptional service and community connection.",
          content: "Ten years ago, Royals Barber Shop opened its doors with a simple mission: to provide exceptional haircuts in a welcoming environment where every client would feel valued. What started as a small shop with just two chairs has grown into a beloved community fixture in Batavia. Over the past decade, we've had the privilege of serving thousands of clients, participating in local charity events, and watching young clients grow from their first haircut to their graduation styles. We're grateful for the continuous support from our community and look forward to many more years of service, innovation, and fostering the timeless barbershop culture that brings people together.",
          imageUrl: "https://pixabay.com/get/gfd51615f49c2e9d8d3b0fd5785473d63497ab1b9026b62cd3a0e930934742a767eefe6cc0d99da7b75e9984ace3ba02b07f265fc17fcb303f6e610f23513d0e2_1280.jpg",
          imageAlt: "Barber History"
        }
      ];

      await db.insert(schema.blogPosts).values(blogPosts);
      console.log(`Inserted ${blogPosts.length} blog posts`);
    } else {
      console.log(`Found ${existingBlogPosts.length} existing blog posts, skipping`);
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
