"use client"
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className='p-6 space-y-3'>
      <div className='text-sm text-red-600'>Terjadi kesalahan: {error.message}</div>
      <button className='px-3 py-1 border rounded' onClick={reset}>Coba lagi</button>
    </div>
  )
}
