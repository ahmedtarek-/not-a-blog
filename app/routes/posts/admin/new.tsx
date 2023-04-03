import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useNavigation,
  Link,
  Outlet,
  useOutletContext
} from "@remix-run/react";

import { createPostYaM3alem } from "~/models/post.server";
import { PostAdmin } from "../admin";

import invariant from "tiny-invariant";

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  const errors = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    markdown: markdown ? null : "Markdown is required",
  };
  const hasErrors = Object.values(errors).some(
    (errorMessage) => errorMessage
  );
  if (hasErrors) {
    return json(errors);
  }

  invariant(
    typeof title === "string",
    "title must be a string"
  );
  invariant(
    typeof slug === "string",
    "slug must be a string"
  );
  invariant(
    typeof markdown === "string",
    "markdown must be a string"
  );

  // TODO: remove me
  await new Promise((res) => setTimeout(res, 1000));

  await createPostYaM3alem({ title, slug, markdown });

  return redirect("/posts/admin");
};

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export default function NewPost() {
  const errors = useActionData<typeof action>();

  const navigation = useNavigation();
  const isCreating = Boolean(
    navigation.state === "submitting"
  );

  if (navigation.formData){
    const [posts] = useOutletContext() as any;
    const newPost = Object.fromEntries(navigation.formData)

    console.log(posts);
    console.log(newPost);
    return (
      <div className="mx-auto max-w-4xl">
        <h1 className="my-6 mb-2 border-b-2 text-center text-3xl">
          Blog Admin
        </h1>
        <div className="grid grid-cols-4 gap-6">
          <nav className="col-span-4 md:col-span-1">
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
          </nav>
          <main className="col-span-4 md:col-span-3">
            <Outlet />
          </main>
        </div>
      </div>
    );
  } else {
    return (
      <Form method="post">
        <p>
          <label>
            Post Title:{" "}
            {errors?.title ? (
              <em className="text-red-600">{errors.title}</em>
            ) : null}
            <input
              type="text"
              name="title"
              className={inputClassName}
            />
          </label>
        </p>
        <p>
          <label>
            Post Slug:{" "}
            {errors?.slug ? (
              <em className="text-red-600">{errors.slug}</em>
            ) : null}
            <input
              type="text"
              name="slug"
              className={inputClassName}
            />
          </label>
        </p>
        <p>
          <label htmlFor="markdown">
            Markdown: {" "}
            {errors?.markdown ? (
              <em className="text-red-600">{errors.markdown}</em>
            ) : null}
          </label>
          <br />
          <textarea
            id="markdown"
            rows={20}
            name="markdown"
            className={`${inputClassName} font-mono`}
          />
        </p>
        <p className="text-right">
          <button
            type="submit"
            className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Create Post"}
          </button>
        </p>
      </Form>
    );
  }

}
