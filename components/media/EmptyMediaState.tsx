export function EmptyMediaState() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
      <svg
        className="mx-auto h-16 w-16 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">No media uploaded</h3>
      <p className="mt-2 text-sm text-gray-500">
        Get started by uploading your first image or media file.
      </p>
      <button
        className="hover:bg-primary/90 mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        disabled
      >
        Upload Media
      </button>
    </div>
  )
}
