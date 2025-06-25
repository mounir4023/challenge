/* eslint-disable @next/next/no-img-element */
'use client'

import { useEffect, useState } from 'react'
import { Element } from '@/lib/types/component'
import { FloatNav } from '@/components/app/float-nav'
import ReactMarkdown from 'react-markdown'

export default function MobilePreviewPage() {
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

  return (
    <div className="max-h-screen bg-background p-4 flex justify-center overflow-y-auto">
        <div className="w-full max-w-md space-y-4">
        {elements.map((el) => {
            const { id, type, props } = el

            return (
            <div key={id} className="w-full">
                {type === 'Text' && (
                <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{String(props.markdown || '')}</ReactMarkdown>
                </div>
                )}

                {type === 'Image' && (
                <img
                    src={props.url as string}
                    className="w-full h-auto object-contain"
                    style={{
                    objectFit: props.sizing === 'Cover' ? 'cover' : 'contain',
                    }}
                    alt="element"
                />
                )}
            </div>
            )
        })}

        <FloatNav />
        </div>
    </div>
    )

}
