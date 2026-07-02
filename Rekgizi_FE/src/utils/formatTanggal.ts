export function formatTanggal(date?: string | Date) {
  if (!date) return '-'

  const d = new Date(date)
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}