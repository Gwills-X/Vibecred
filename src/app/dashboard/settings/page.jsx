import getAuthUser from "@/lib/getAuthUser";
import EditProfileForm from "./components/EditProfileForm";

export default async function EditProfilePage() {
  const user = await getAuthUser();
  if (!user) return <p>Unauthorized</p>;

  return (
    <div className='max-w-5xl mx-auto py-10 '>
      <h1 className='text-3xl font-black text-white mb-8'>Account Settings</h1>
      {/* Pass user data as props to the Client Component */}
      <EditProfileForm initialUser={user} />
    </div>
  );
}
