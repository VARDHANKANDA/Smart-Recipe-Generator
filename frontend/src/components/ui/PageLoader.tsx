export function PageLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-saffron-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="glass flex items-center gap-4 rounded-[8px] px-5 py-4">
        <span className="h-3 w-3 animate-ping rounded-full bg-saffron-500" />
        <span className="text-sm font-bold">Preparing your kitchen...</span>
      </div>
    </div>
  );
}

