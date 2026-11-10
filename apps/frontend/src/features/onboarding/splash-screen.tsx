export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-background">
      {/* TODO: Add a logo animation*/}
      {/* TODO (#171): Replace placeholder with the final app logo. */}
      <img src="/favicon.svg" alt="" className="size-24" />
      <h1 className="text-3xl font-bold">helthTW</h1>
    </div>
  );
}
