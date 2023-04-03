import { prisma } from "~/db.server";
import type { Post } from "@prisma/client";

type Post = {
    slug: string,
    title: string
}

export async function getPostsMan(): Promise<Array<Post>> {
  return prisma.post.findMany();
}

export async function getJustOnePostMan(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export async function createPostYaM3alem(
  post: Pick<Post, "slug" | "title" | "markdown">
) {
  return prisma.post.create({ data: post });
}
