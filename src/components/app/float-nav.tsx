'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Monitor, Smartphone, Undo2 } from 'lucide-react'

export function FloatNav() {
  const pathname = usePathname()
  const router = useRouter()

  const isMobile = pathname === '/preview/mobile'
  const isDesktop = pathname === '/preview/desktop'
  const isBuilder = pathname === '/builder'

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">

      {isBuilder && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push('/preview/desktop')}
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push('/preview/mobile')}
          >
            <Smartphone className="w-4 h-4" />
          </Button>
        </>
      )}

      {(isMobile || isDesktop) && (
        <>

          {isMobile && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push('/preview/desktop')}
            >
              <Monitor className="w-4 h-4" />
            </Button>
          )}

          {isDesktop && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push('/preview/mobile')}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push('/builder')}
          >
            <Undo2 className="w-4 h-4" />
          </Button>

        </>
      )}
    </div>
  )
}
