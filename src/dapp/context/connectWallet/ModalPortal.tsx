import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

export const ModalPortal = ({ children }: { children: ReactNode }) => {
  const [container, setContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (typeof document === 'undefined') return
    const modalRoot = document.createElement('div')
    modalRoot.className = 'wt-modal-root'
    document.body.appendChild(modalRoot)
    setContainer(modalRoot)
    return () => {
      document.body.removeChild(modalRoot)
      setContainer(null)
    }
  }, [])

  if (!container) return null
  return createPortal(children, container)
}
