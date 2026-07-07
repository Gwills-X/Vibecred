import BackLink from "@/components/BackLink";

export default function AboutPage() {
  return (
    <main className='max-w-3xl mx-auto py-16 px-6'>
      <BackLink />
      <h1 className='text-4xl font-bold text-white mb-6'>About VibeCred</h1>
      <div className='text-slate-400 space-y-4'>
        <p>
          VibeCred is a professional collective built to bridge the gap between
          different fields—from technology and science to strategy and design.
        </p>
        <p>
          Our goal is to provide a neutral, professional environment where
          diverse perspectives lead to better ideas. Whether you are a
          programmer in Bauchi or a strategist elsewhere, your contribution adds
          value to the collective.
        </p>
        <p>
          This platform is independently built and managed by GW-TECK SOLUTIONS.
        </p>
      </div>
    </main>
  );
}
