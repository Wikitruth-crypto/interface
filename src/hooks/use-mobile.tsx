import * as React from "react"

const MOBILE_BREAKPOINT = 768      
const EXTRA_SMALL_BREAKPOINT = 375 
const TINY_BREAKPOINT = 320        

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < MOBILE_BREAKPOINT
    }
    return false
  })

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    window.addEventListener("resize", handleResize)
    handleResize()
    
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return isMobile
}

export function useIsExtraSmall() {
  const [isExtraSmall, setIsExtraSmall] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < EXTRA_SMALL_BREAKPOINT
    }
    return false
  })

  React.useEffect(() => {
    const handleResize = () => {
      setIsExtraSmall(window.innerWidth < EXTRA_SMALL_BREAKPOINT)
    }
    
    window.addEventListener("resize", handleResize)
    handleResize()
    
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return isExtraSmall
}

export function useIsTiny() {
  const [isTiny, setIsTiny] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= TINY_BREAKPOINT
    }
    return false
  })

  React.useEffect(() => {
    const handleResize = () => {
      setIsTiny(window.innerWidth <= TINY_BREAKPOINT)
    }
    
    window.addEventListener("resize", handleResize)
    handleResize()
    
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return isTiny
}


