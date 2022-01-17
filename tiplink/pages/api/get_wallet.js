import { PrismaClient } from '@prisma/client'

export default async (req, res) => {
  if(req.method == 'GET') {
    const prisma = new PrismaClient()
    console.log(req.query.slug);
    const result = await prisma.wallet.findUnique({
      where: {
        id: req.query.slug,
      },
      select: {
        cipher: true,
      },
    });
    prisma.$disconnect();
    const cipher = result !== null ? result.cipher : null;
    res.status(200).json({cipher: cipher});
  } else {
    res.status(501).json({message: "only GET request to create_wallet supported"});
  }
}
