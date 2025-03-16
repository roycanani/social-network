import { Feed } from "../components/feed";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
      <div className="w-full max-w-md mx-auto">
        <Feed />
      </div>
    </main>
  );
}
