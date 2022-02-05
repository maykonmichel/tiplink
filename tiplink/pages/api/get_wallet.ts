import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method == 'GET') {
    const prisma = new PrismaClient()
    const slug = Array.isArray(req.query.slug) ? req.query.slug[0] : req.query.slug;
    const result = await prisma.wallet.findUnique({
      where: {
        id: slug,
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
