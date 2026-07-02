export function formatJam(time?: string | Date) {
    if (!time) return '-'

    if (typeof time === 'string' && /^\d{2}:\d{2}(:\d{2})?$/.test(time)) {
        const [hour, minute] = time.split(':')
        return `${hour}.${minute}`
    }

    const d = new Date(time)
    if (isNaN(d.getTime())) return String(time)

    return d.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
    })
}