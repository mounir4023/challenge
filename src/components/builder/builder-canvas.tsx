/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { Element } from '@/lib/types/component'
import { cn } from '@/lib/utils'

export default function BuilderCanvas({
  elements,
  onSelectElement,
  selectedElement,
}: {
  elements: Element[]
  onSelectElement: (element: Element) => void
  selectedElement: Element | null
}) {
  return (
    <div className="p-4 w-full">
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridAutoRows: '80px',
        }}
      >
        {elements.map(el => {
          const isSelected = selectedElement?.id === el.id
          return (
            <div
              key={el.id}
              onClick={() => onSelectElement(el)}
              className={cn(
                'p-2 rounded-md border text-sm transition-colors cursor-pointer',
                'bg-card border-border',
                isSelected
                  ? 'ring-2 ring-ring bg-accent text-accent-foreground'
                  : 'hover:bg-accent/40'
              )}
              style={{
                gridColumn: `span ${el.width}`,
                gridRow: `span ${el.height}`,
              }}
            >
              {renderElementContent(el)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function renderElementContent(element: Element) {
  const { type, props } = element

  if (type === 'Text') {
    return (
      <div
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: String(props.markdown || '') }}
      />
    )
  }

  if (type === 'Image') {
    return (
      <img
        src={String(props.url || '')}
        alt="Image"
        className="w-full h-full object-center"
        style={{
          objectFit:
            (props.sizing as string)?.toLowerCase() === 'cover'
              ? 'cover'
              : 'contain',
        }}
      />
    )
  }

  return <div className="italic text-muted-foreground">Unknown component</div>
}

/*
function renderElementContent(element: Element): React.ReactNode {
  const { type, props } = element;

  if (type === 'Text') {
    return (
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: String(props.markdown || '') }}
      />
    );
  }

  if (type === 'Image') {
    return (
      <img
        src={String(props.url || '')}
        style={{
          objectFit: (props.sizing as string)?.toLowerCase() === 'cover' ? 'cover' : 'contain',
          width: '100%',
          height: '100%',
        }}
      />
    );
  }

  return <div>Unknown component</div>;
}
*/

/*
function Canvas({ elements }: { elements: Element[] }) {
  return (
    <div
      className="grid gap-2"
      style={{
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridAutoRows: '80px', // or any height unit you like
      }}
    >
      {elements.map(el => (
        <div
          key={el.id}
          className="border p-2 rounded shadow-sm bg-white"
          style={{
            gridColumn: `span ${el.width}`,
            gridRow: `span ${el.height}`,
          }}
        >
          {renderElementContent(el)}
        </div>
      ))}
    </div>
  );
}
*/