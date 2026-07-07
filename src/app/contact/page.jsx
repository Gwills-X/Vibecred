import BackLink from "@/components/BackLink";

export default function ContactPage() {
  return (
    <main className='max-w-3xl mx-auto py-16 px-6'>
      <BackLink />
      <h1 className='text-4xl font-bold text-white mb-6'>Contact Support</h1>
      <div className='text-slate-400 space-y-4'>
        <p>
          Have questions, feedback, or need assistance? We are here to help.
        </p>
        <p>You can reach our support team directly at:</p>
        <a
          href='mailto:support@vibecred.com'
          className='text-emerald-400 font-bold hover:underline'>
          support@vibecred.com
        </a>
        <p className='pt-4 text-sm'>
          Based in Bauchi, Nigeria. We strive to respond to all inquiries within
          48 hours.
        </p>
      </div>
    </main>
  );
}
