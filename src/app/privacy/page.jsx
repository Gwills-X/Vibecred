import BackLink from "@/components/BackLink";

export default function PrivacyPage() {
  return (
    <main className='max-w-3xl mx-auto py-16 px-6'>
      <BackLink />
      <h1 className='text-4xl font-bold text-white mb-6'>Privacy Policy</h1>
      <div className='text-slate-400 space-y-4 text-sm'>
        <p>
          We respect your privacy. At VibeCred, we only collect the information
          necessary to provide you with a functional professional profile.
        </p>
        <p>
          We do not sell your data to third parties. Your data is used
          exclusively to facilitate connection and content sharing within the
          collective.
        </p>
      </div>
    </main>
  );
}
