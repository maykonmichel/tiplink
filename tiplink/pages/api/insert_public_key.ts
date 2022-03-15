import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method == 'POST') {
    const prisma = new PrismaClient()
    try {
      const public_key: Array<string> = await prisma.$queryRaw`insert into address (public_key) values (${req.body.publicKey}) RETURNING public_key`
      res.status(200).json({success: (public_key !== null)});
    } catch(err) {
      res.status(303).json({success: false, messages: [err]});
    } finally {
      prisma.$disconnect();
    }
  } else {
    res.status(501).json({message: "only POST request to insert_public_key supported"});
  }
}
