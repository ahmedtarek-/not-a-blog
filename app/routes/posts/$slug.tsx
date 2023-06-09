import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getJustOnePostMan } from "~/models/post.server"

export const loader = async ({ params } : LoaderArgs) => {
    invariant(params.slug, `params.slug is required`);
    const post = await getJustOnePostMan(params.slug)

    invariant(post, `Post not found: ${params.slug}`);
    return json({ post });
};

export default function PostSlug() {
    const { post } = useLoaderData<typeof loader>();
    return (
        <main className="mx-auto max-w-4xl">
          <h1 className="my-6 border-b-2 text-center text-3xl">
            Some Post: { post.title }
          </h1>
        </main>
  );
}