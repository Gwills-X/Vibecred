import getAuthUser from "@/lib/getAuthUser";
import SecurityPage from "./SecurityPage";

export default async function page() {
  const user = await getAuthUser();
  console.log("EditProfilePage: Retrieved user:", user);
  if (!user) return <p>Unauthorized</p>;
  return (
    <div className='max-w-5xl mx-auto py-10 '>
      <SecurityPage userId={user.userId} />
    </div>
  );
}
