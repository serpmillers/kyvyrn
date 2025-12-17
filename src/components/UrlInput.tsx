interface UrlInputProps {
  value: string
  onChange: (value: string) => void
}

function UrlInput({ value, onChange }: UrlInputProps) {
  return (
    <div className="mb-4">
      <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
        Enter Website URL
      </label>
      <input
        type="url"
        id="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://example.com"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

export default UrlInput