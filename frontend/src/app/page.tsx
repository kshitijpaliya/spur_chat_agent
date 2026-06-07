import ChatWindow from "@/components/ChatWindow";

export default function Home() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#f6f7fb]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_32%),radial-gradient(circle_at_80%_10%,_rgba(39,39,42,0.10),_transparent_28%)]" />
      <section className="relative mx-auto flex min-h-dvh w-full max-w-6xl items-center px-6 py-12">
        <div className="max-w-2xl">
          <div className="mb-5 inline-flex rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-sm font-semibold text-emerald-700 shadow-sm">
            AI-powered support widget
          </div>
          <h1 className="text-4xl font-semibold leading-tight text-zinc-950 sm:text-5xl">
            Mini AI Support Assistant For A Live Chat Widget
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600">
            Ask about shipping, returns, refunds, or support hours from the chat
            widget in the bottom-right corner.
          </p>
        </div>
      </section>
      <ChatWindow />
    </main>
  );
}
