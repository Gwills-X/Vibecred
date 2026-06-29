// src/app/posts/create/page.jsx
import { createPosts } from "@/actions/posts";
import BlogPostForm from "@/components/PostForm";

export const dynamic = "force-dynamic"; // <--- THIS IS THE KEY

export default async function CreatePage() {
  return (
    <div className='min-h-[calc(100vh-200px)] flex items-center justify-center px-1 py-6 bg-transparent'>
      <div className='w-full'>
        <BlogPostForm handler={createPosts} />
      </div>
    </div>
  );
}
