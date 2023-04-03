import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getPostsMan } from "~/models/post.server"

export const loader = async () => {
  return json({ posts: await getPostsMan() });
};

export default function Posts() {
  const { posts } = useLoaderData<typeof loader>();
  console.log(posts);
  return (
    <main>
      <h1>Tarek (here are teh poest mans)</h1>
      <Link to="admin" className="text-red-600 underline">
        Admin
      </Link>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              to={post.slug}
              className="text-blue-600 underline"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
