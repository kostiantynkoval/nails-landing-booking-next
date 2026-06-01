import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const DEV_PASSWORD = process.env.ADMIN_PASSWORD ?? "Adm!nPassw0rd";
const TECH_PASSWORD = process.env.TECHNICIAN_PASSWORD ?? "T@chPassw0rd";

const services = [
  {
    name: "Classic Manicure",
    description: "Shape, cuticle care, massage, and polish.",
    durationMin: 45,
    price: 35,
  },
  {
    name: "Gel Manicure",
    description: "Long-lasting gel polish with prep and finish.",
    durationMin: 60,
    price: 55,
  },
  {
    name: "Gel Extensions",
    description: "Builder gel extensions sculpted to your preferred shape.",
    durationMin: 90,
    price: 85,
  },
  {
    name: "Custom Nail Art",
    description: "Hand-painted designs or accents per nail.",
    durationMin: 30,
    price: 15,
  },
  {
    name: "Classic Pedicure",
    description: "Foot soak, exfoliation, massage, and polish.",
    durationMin: 50,
    price: 45,
  },
  {
    name: "Luxury Spa Pedicure",
    description: "Extended massage, mask, and premium polish.",
    durationMin: 75,
    price: 70,
  },
  {
    name: "Mani + Pedi Combo",
    description: "Gel manicure and classic pedicure bundle.",
    durationMin: 105,
    price: 100,
  },
  {
    name: "Gel Removal",
    description: "Safe gel removal without damage to natural nails.",
    durationMin: 30,
    price: 20,
  },
] as const;

const weekdayHours = { openTime: "10:00", closeTime: "20:00" };
const saturdayHours = { openTime: "10:00", closeTime: "18:00" };

async function seedTechnician(
  email: string,
  name: string,
  password: string,
  bio: string,
  specialties: string[],
) {
  const passwordHash = await hash(password, 12);
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name,
      passwordHash,
      role: "TECHNICIAN",
      technicianProfile: {
        create: {
          bio,
          specialties,
        },
      },
    },
    include: { technicianProfile: true },
  });

  const profileId = user.technicianProfile!.id;

  for (const dayOfWeek of [1, 2, 3, 4, 5]) {
    await prisma.workingHours.upsert({
      where: {
        technicianId_dayOfWeek: { technicianId: profileId, dayOfWeek },
      },
      update: weekdayHours,
      create: { technicianId: profileId, dayOfWeek, ...weekdayHours },
    });
  }

  await prisma.workingHours.upsert({
    where: {
      technicianId_dayOfWeek: { technicianId: profileId, dayOfWeek: 6 },
    },
    update: saturdayHours,
    create: {
      technicianId: profileId,
      dayOfWeek: 6,
      ...saturdayHours,
    },
  });

  return user;
}

async function main() {
  const adminHash = await hash(DEV_PASSWORD, 12);

  await prisma.user.upsert({
    where: { email: "admin@maiianails.example" },
    update: {},
    create: {
      email: "admin@maiianails.example",
      name: "Salon Admin",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

  await seedTechnician(
    "maiia@maiianails.example",
    "Maiia",
    TECH_PASSWORD,
    "Lead artist specializing in gel and extensions.",
    ["Gel Extensions", "Nail Art", "French"],
  );

  await seedTechnician(
    "sofia@maiianails.example",
    "Sofia",
    TECH_PASSWORD,
    "Nail art and luxury pedicure specialist.",
    ["Nail Art", "Pedicure", "Chrome"],
  );

  for (const service of services) {
    const existing = await prisma.service.findFirst({
      where: { name: service.name },
    });
    if (existing) {
      await prisma.service.update({
        where: { id: existing.id },
        data: {
          description: service.description,
          durationMin: service.durationMin,
          price: service.price,
          isActive: true,
        },
      });
    } else {
      await prisma.service.create({
        data: {
          name: service.name,
          description: service.description,
          durationMin: service.durationMin,
          price: service.price,
        },
      });
    }
  }

  console.log("Seed complete. Passwords are stored in the .env file.");
  console.log("Admin: admin@maiianails.example /");
  console.log("Technicians: maiia@ / sofia@maiianails.example /");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
