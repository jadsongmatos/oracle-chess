import { useEffect } from 'react'
import { useRouter } from 'next/router'

const pageview = (url) => {
  window.dataLayer.push({
    event: 'pageview',
    page: url,
  })
}

const GoogleTagManager = ({ children }) => {
  const router = useRouter()

  useEffect(() => {
    router.events.on('routeChangeComplete', pageview)
    return () => {
      router.events.off('routeChangeComplete', pageview)
    }
  }, [router.events])

  return children
}

export default GoogleTagManager