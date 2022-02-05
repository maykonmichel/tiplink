import { PrismaClient } from '@prisma/client'

export default async (req, res) => {
  if(req.method == 'GET') {
    const prisma = new PrismaClient()
    const result = await prisma.wallet.findUnique({
      where: {
        id: req.query.slug,
      },
      select: {
        salt: true,
      },
    });
    prisma.$disconnect();
    if(result !== null) {
      res.status(200).json({salt: result.salt});
    } else {
      res.status(200).json({salt: null});
    }
  } else {
    res.status(501).json({message: "only GET request to create_wallet supported"});
  }
}
