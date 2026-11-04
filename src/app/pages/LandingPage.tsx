import { ContourMapBackground } from "../components/ContourMapBackground";

export default function LandingPage() {
  return (
    <main className="grid min-h-screen min-h-dvh place-items-center overflow-hidden bg-white">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <ContourMapBackground opacity={0.4} showPeople theme="light" />
      </div>
      <img
        src="/images/plus-ultra-logo.svg"
        alt="Plus Ultra"
        width={981}
        height={320}
        className="relative block h-auto w-[256px] max-w-[calc(100vw-48px)] brightness-0 sm:w-[342px]"
      />
    </main>
  );
}
