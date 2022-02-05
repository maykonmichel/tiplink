import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from "next";

type WalletResult =  {
  id: string
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method == 'POST') {
    const prisma = new PrismaClient()
    console.log(req.body);
    const wallet: Array<WalletResult> = await prisma.$queryRaw`insert into wallet (pubkey, salt) values (${req.body.pubkey}, ${req.body.salt}) RETURNING id`
    prisma.$disconnect();
    res.status(200).json({slug: wallet[0].id});
  } else {
    res.status(501).json({message: "only POST request to create_wallet supported"});
  }
}
