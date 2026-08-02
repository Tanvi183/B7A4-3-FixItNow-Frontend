import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="flex items-center justify-center w-24 h-24 bg-blue-50 text-blue-600 rounded-full mb-8">
        <AlertCircle size={48} strokeWidth={1.5} />
      </div>
      <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
        Page Not Found
      </h2>
      <p className="text-lg text-slate-500 max-w-md mx-auto mb-10">
        Oops! We couldn't find the page you were looking for. It might have been moved or doesn't exist.
      </p>
      <Link 
        href="/"
        className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
      >
        <ArrowLeft size={18} />
        Back to Home
      </Link>
    </div>
  );
}
