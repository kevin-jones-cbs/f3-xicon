import Link from "next/link";
import { BookOpen, Dumbbell } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-12">F3 Xicon</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
        <Link 
          href="/lexicon"
          className="flex flex-col items-center p-8 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
        >
          <BookOpen className="w-12 h-12 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Lexicon</h2>
          <p className="text-gray-600 text-center">Browse and search F3 terminology and definitions</p>
        </Link>

        <Link 
          href="/exicon"
          className="flex flex-col items-center p-8 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
        >
          <Dumbbell className="w-12 h-12 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Exicon</h2>
          <p className="text-gray-600 text-center">Explore F3 exercises and workout routines</p>
        </Link>
      </div>
    </div>
  );
}
