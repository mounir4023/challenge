/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useState } from 'react'
import { Element } from '@/lib/types/component'
import { FloatNav } from '@/components/app/float-nav'
import ReactMarkdown from 'react-markdown'

export default function DesktopPreviewPage() {
  const [elements, setElements] = useState<Element[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('canvas-elements')
      if (stored) {
        try {
          setElements(JSON.parse(stored))
        } catch {
          // fallback: leave empty
        }
      }
    }
  }, [])

  /*
  const maxY = elements.reduce(
    (max, el) => Math.max(max, el.y + el.height - 1),
    0
  )
  const NUM_ROWS = maxY + 2
  */

  return (
    <div className="max-h-screen bg-background p-4 overflow-y-auto">
      <div
        className="grid gap-2 grid-cols-12 pb-20"
        style={{ gridAutoRows: '80px' }}
      >
        {elements.map((el) => {
          const { id, type, props, x, y, width, height } = el

          return (
            <div
              key={id}
              className="overflow-hidden"
              style={{
                gridColumn: `${x} / span ${width}`,
                gridRow: `${y} / span ${height}`,
              }}
            >
              {type === 'Text' && (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{String(props.markdown || '')}</ReactMarkdown>
                </div>
              )}

              {type === 'Image' && (
                <img
                  src={props.url as string}
                  className="w-full h-full object-contain"
                  style={{
                    objectFit:
                      (props.sizing as string).toLowerCase() === 'cover' ? 'cover' : 'contain',
                  }}
                  alt="element"
                />
              )}
            </div>
          )
        })}
      </div>

      <FloatNav />
    </div>
  )
}
