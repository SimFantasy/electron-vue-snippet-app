import type { ShallowRef } from 'vue'

export function useIgnoreMouseEvents() {
  const setIgnoreMouseEvents = <T extends HTMLElement>(el: ShallowRef<T>) => {
    if (!el.value) return

    // 在目标元素上时，不可穿透鼠标事件（可交互）
    el.value.addEventListener('mouseover', () => {
      window.api.setIgnoreMouseEvents(false)
    })

    // 离开目标元素使，穿透
    document.body?.addEventListener('mouseover', (e: MouseEvent) => {
      if (e.target === document.body) {
        window.api.setIgnoreMouseEvents(true, { forward: true })
      }
    })

    // 初始时，穿透鼠标事件
    window.api.setIgnoreMouseEvents(true, { forward: true })
  }

  return { setIgnoreMouseEvents }
}
