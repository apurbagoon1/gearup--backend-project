import { prisma } from "../src/lib/prisma";
import { Role } from "../generated/prisma/client";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding database...");

  // ==========================
  // Admin User
  // ==========================

  const adminExists = await prisma.user.findUnique({
    where: {
      email: "admin@gearup.com",
    },
  });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await prisma.user.create({
      data: {
        name: "System Admin",
        email: "admin@gearup.com",
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });

    console.log("Admin created.");
  } else {
    console.log("Admin already exists.");
  }

  // ==========================
  // Default Categories
  // ==========================

  const categories = [
    {
      name: "Cycling",
      description: "Bikes and cycling accessories",
    },
    {
      name: "Camping",
      description: "Camping equipment",
    },
    {
      name: "Fitness",
      description: "Gym and fitness gear",
    },
    {
      name: "Hiking",
      description: "Outdoor hiking equipment",
    },
    {
      name: "Water Sports",
      description: "Kayaks, surfboards and water gear",
    },
  ];

  for (const category of categories) {
    const exists = await prisma.category.findFirst({
      where: {
        name: category.name,
      },
    });

    if (!exists) {
      await prisma.category.create({
        data: category,
      });

      console.log(`${category.name} created.`);
    }
  }

  console.log("Database seed completed.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });