/** Static services for MVP until BookingService (Prisma) is wired in Phase 2 */
export type SalonService = {
  id: string;
  name: string;
  description: string;
  durationMin: number;
  price: number;
  category: "manicure" | "pedicure" | "nail-art" | "addons";
};

export const salonServices: SalonService[] = [
  {
    id: "classic-manicure",
    name: "Classic Manicure",
    description: "Shape, cuticle care, massage, and polish.",
    durationMin: 45,
    price: 35,
    category: "manicure",
  },
  {
    id: "gel-manicure",
    name: "Gel Manicure",
    description: "Long-lasting gel polish with prep and finish.",
    durationMin: 60,
    price: 55,
    category: "manicure",
  },
  {
    id: "gel-extensions",
    name: "Gel Extensions",
    description: "Builder gel extensions sculpted to your preferred shape.",
    durationMin: 90,
    price: 85,
    category: "manicure",
  },
  {
    id: "nail-art",
    name: "Custom Nail Art",
    description: "Hand-painted designs or accents per nail.",
    durationMin: 30,
    price: 15,
    category: "nail-art",
  },
  {
    id: "classic-pedicure",
    name: "Classic Pedicure",
    description: "Foot soak, exfoliation, massage, and polish.",
    durationMin: 50,
    price: 45,
    category: "pedicure",
  },
  {
    id: "spa-pedicure",
    name: "Luxury Spa Pedicure",
    description: "Extended massage, mask, and premium polish.",
    durationMin: 75,
    price: 70,
    category: "pedicure",
  },
  {
    id: "combo-mani-pedi",
    name: "Mani + Pedi Combo",
    description: "Gel manicure and classic pedicure bundle.",
    durationMin: 105,
    price: 90,
    category: "addons",
  },
  {
    id: "removal",
    name: "Gel Removal",
    description: "Safe gel removal without damage to natural nails.",
    durationMin: 30,
    price: 20,
    category: "addons",
  },
];

export const salonInfo = {
  name: "Maiia Nails",
  tagline: "Boutique nail artistry & tailored treatments",
  phone: "+1 365 737 4477",
  email: "maushe4ka@gmail.com",
  address: "132-4222 Dixie Road, Mississauga, ON, Canada",
  hours: [
    { days: "Mon – Fri", time: "10:00 – 20:00" },
    { days: "Saturday", time: "10:00 – 18:00" },
    { days: "Sunday", time: "Closed" },
  ],
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d254508.391!2d30.5234!3d50.4501!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDI3JzAwLjQiTiAzMMKwMzEnMjQuMiJF!5e0!3m2!1sen!2sua!4v1",
} as const;
