export default function LoadingSpinner({ message }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
      {message && <p className="text-sm text-gray-400">{message}</p>}
    </div>
  );
}
