import BackLink from "@/components/BackLink";

export default function TermsPage() {
  return (
    <main className='max-w-3xl mx-auto py-16 px-6'>
      <BackLink />
      <h1 className='text-4xl font-bold text-white mb-6'>Terms of Service</h1>
      <div className='text-slate-400 space-y-4 text-sm'>
        <p>
          By using VibeCred, you agree to these terms. Our platform is a
          professional space dedicated to constructive exchange.
        </p>
        <p>
          <strong>Content Ownership:</strong> You retain rights to the content
          you post, but you grant VibeCred the right to display it within our
          collective.
        </p>
        <p>
          <strong>Account Responsibility:</strong> You are responsible for
          maintaining the security of your account credentials.
        </p>
        <p>
          <strong>Termination:</strong> We reserve the right to suspend accounts
          that violate our community guidelines or engage in malicious activity.
        </p>
      </div>
    </main>
  );
}
