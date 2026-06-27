import DashboardNav from "../DashboardNav";

export default function MediaVaultPage() {
  // Mock assets - replace this with your Firebase fetch logic later
  const assets = [
    { id: 1, name: "hero_background.jpg", size: "2.4MB" },
    { id: 2, name: "network_schema_01.png", size: "840KB" },
    { id: 3, name: "vibe_icon_set.svg", size: "12KB" },
  ];

  return (
    <div className='max-w-7xl mx-auto space-y-8 py-8 px-4'>
      <div className='flex flex-col gap-6'>
        <div>
          <h1 className='text-3xl font-black text-white'>Media Vault</h1>
          <p className='text-emerald-500 font-mono text-sm mt-1'>
            Centralized asset management and binary storage
          </p>
        </div>
        <DashboardNav />
      </div>

      {/* Upload Zone */}
      <div className='glass-card p-8 border-dashed border-emerald-500/20 text-center hover:border-emerald-500/40 transition-all'>
        <button className='text-emerald-400 font-bold text-sm'>
          + Upload New Asset
        </button>
        <p className='text-[10px] text-slate-500 mt-2 font-mono'>
          Supported: JPG, PNG, SVG, WEBP
        </p>
      </div>

      {/* Assets Grid */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {assets.map((asset) => (
          <div
            key={asset.id}
            className='glass-card p-4 hover:border-emerald-500/30 transition-all group'>
            <div className='aspect-square bg-slate-950/50 rounded-lg mb-3 flex items-center justify-center text-emerald-500/20'>
              <svg className='w-8 h-8' fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z' />
              </svg>
            </div>
            <h3 className='text-xs font-bold text-slate-200 truncate'>
              {asset.name}
            </h3>
            <p className='text-[10px] text-slate-500 font-mono'>{asset.size}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
