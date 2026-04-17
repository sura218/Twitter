// utils/formatDate.ts
export function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()

  const diff = (now.getTime() - date.getTime()) / 1000

  if (diff < 60) return `${Math.floor(diff)}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`

  return date.toLocaleDateString()
}