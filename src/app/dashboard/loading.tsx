export default function Loading() {
  return (
    <div className="p-6 animate-pulse">
      <div className="mb-6 h-8 w-48 bg-gray-200 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
}
