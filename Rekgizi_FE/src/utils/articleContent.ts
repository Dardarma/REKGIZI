import { ImageUrl } from '@/utils/baseURL'

export function resolveArticleContentImages(html: string | null | undefined): string {
  if (!html) return ''

  const container = document.createElement('div')
  container.innerHTML = html

  container.querySelectorAll<HTMLImageElement>('img[src]').forEach((image) => {
    const source = image.getAttribute('src')?.trim()
    if (!source || /^(https?:|data:|blob:)/i.test(source)) return

    const path = source.startsWith('/') ? source : `/${source}`
    image.setAttribute('src', ImageUrl(path))
  })

  return container.innerHTML
}
