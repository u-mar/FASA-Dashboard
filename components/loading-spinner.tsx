export default function LoadingSpinner() {
  return (
    <div className="flex h-[400px] w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>
      <span className="ml-2 text-gray-500">Loading...</span>
    </div>
  )
}
