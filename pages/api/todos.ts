// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import type { Todo } from "../../models";
import prisma from "../../lib/prisma";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Todo | Todo[]>
) {
  if (req.method === "GET") {
    const todos = await prisma.todo.findMany();

    res.status(200).json(todos);
  }

  if (req.method === "POST") {
    const todo = await prisma.todo.create({ data: req.body });
    res.status(201).json(todo);
  }
}
