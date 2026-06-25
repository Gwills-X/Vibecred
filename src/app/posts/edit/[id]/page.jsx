import EditPost from "@/components/Edit";
import getAuthUser from "@/lib/getAuthUser";
import { dataEngine } from "@/services/dataEngine"; // 1. Hook up the master engine switchboard
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function EditPostPage({ params }) {
  // 1. Fetch parameters and check session authentication
  const { id } = await params;
  const user = await getAuthUser();

  // Route Guard: If user isn't logged in, instantly bounce to login page
  if (!user) {
    return redirect("/login");
  }

  // 2. Fetch the post via the data switchboard engine instead of raw SQL strings
  // This seamlessly resolves collections from either local XAMPP or Cloud Firestore
  const postRecord = await dataEngine.getPostById(id);
  console.log("Staging Edit Unified Payload:", postRecord);

  const postExists = !!postRecord;
  console.log(postRecord);

  // 3. SECURE AUTHENTICATED OWNER VERIFICATION GUARD
  if (postExists) {
    // Check if the current user's ID matches the post author's ID string safely
    if (String(postRecord.authorId) !== String(user.userId)) {
      console.warn(
        `Unauthorized access attempt by User ID ${user.userId} on Post ID ${id}`,
      );
      return redirect("/"); // Secretly bounce them out to safety if they don't own this post
    }
  }

  // 4. CLEAN DEVELOPER 404 STATE CONTAINER
  if (!postExists) {
    return (
      <div className='min-h-[calc(100vh-200px)] flex items-center justify-center px-4'>
        <div className='max-w-md w-full bg-slate-900/40 backdrop-blur-md border border-slate-800/80 p-8 rounded-2xl text-center space-y-5 shadow-2xl'>
          <div className='mx-auto w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 text-sm font-bold font-mono'>
            !
          </div>
          <div className='space-y-1'>
            <h1 className='text-xl font-bold tracking-tight text-slate-100'>
              Target Record Absent
            </h1>
            <p className='text-sm text-slate-400 leading-relaxed'>
              The article instance referenced by ID{" "}
              <span className='text-rose-400 font-mono'>#{id}</span> cannot be
              pulled from the active schema table.
            </p>
          </div>
          <Link
            href='/dashboard'
            className='inline-flex w-full items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium px-4 py-2.5 rounded-xl text-sm transition-all border border-slate-700/60'>
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // 5. SUCCESSFUL RENDER DISPLAY LAYER
  return (
    <div className='w-full max-w-7xl mx-auto py-4'>
      {/* Passing down the unified data record payload directly to the interactive form */}
      <EditPost post={postRecord} />
    </div>
  );
}
