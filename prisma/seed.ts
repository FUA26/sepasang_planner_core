import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCategories() {
  const categoryTitles = [
    'Fotografi',
    'Videografi',
    'Undangan',
    'Venue',
    'Dekorasi',
    'Band',
    'Katering',
    'Gaun & Busana Pengantin',
    'Kue Pengantin',
    'Suvenir & Hadiah',
    'Bunga',
    'Perhiasan',
    'Busana Pria',
    'Wedding Organization',
    'Rental',
    'Bridal',
    'Hair & Makeup',
    'Master Ceremony (MC)',
    'Kesehatan & Kecantikan',
    'Bulan madu',
    'Aksesori Pernikahan',
    'Sepatu Pengantin',
    'Photo booth',
  ];

  const categorySeeds = categoryTitles.map((title) => ({
    title,
  }));

  await prisma.category.createMany({
    data: categorySeeds,
  });

  console.log('Category seeding completed.');
}

seedCategories()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
