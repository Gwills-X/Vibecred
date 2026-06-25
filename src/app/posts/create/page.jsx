import { createPosts } from "@/actions/posts"; // Kept mapped to your primary action path
import BlogPostForm from "@/components/PostForm";

export default async function CreatePage() {
  return (
    <div className='min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-6 bg-transparent'>
      <div className='w-full'>
        <BlogPostForm handler={createPosts} />
      </div>
    </div>
  );
}
