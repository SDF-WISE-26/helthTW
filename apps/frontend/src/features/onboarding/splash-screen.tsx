export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-background">
      <style>{`
        @keyframes splash-wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-8deg); }
          75% { transform: rotate(8deg); }
        }

        @media (prefers-reduced-motion: no-preference) {
          .splash-heart {
            animation: splash-wiggle 700ms ease-in-out 2;
          }
        }
      `}</style>

      {/* TODO (#171): Replace placeholder with the final app logo. */}
      <img src="/favicon.svg" alt="" className="splash-heart size-24" />
      <h1 className="text-3xl font-bold">helthTW</h1>
    </div>
  );
}
