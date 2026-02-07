import type { ShallowRef } from 'vue'

export function useIgnoreMouseEvents() {
  const setIgnoreMouseEvents = <T extends HTMLElement>(el: ShallowRef<T>) => {
    if (!el.value) return

    el.value.addEventListener('mouseover', () => {
      window.api.setIgnoreMouseEvents(false)
    })

    document.body?.addEventListener('mouseover', (e: MouseEvent) => {
      if (e.target === document.body) {
        window.api.setIgnoreMouseEvents(true, { forward: true })
      }
    })
  }

  return { setIgnoreMouseEvents }
}
