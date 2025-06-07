import GeminiChat from '../components/GeminiChat';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Chat with Gemini AI
        </h1>
        <GeminiChat />
      </div>
    </main>
  );
}