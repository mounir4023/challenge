/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { Element } from '@/lib/types/component'
import { cn } from '@/lib/utils'

export default function BuilderCanvas({
  elements,
  onSelectElement,
  selectedElement,
  isPlacing,
  onAddElementAtCell,
}: {
  elements: Element[]
  onSelectElement: (element: Element) => void
  selectedElement: Element | null
  isPlacing: boolean
  onAddElementAtCell: (col: number, row: number) => void
}) {

  const maxY = elements.reduce((max, el) => Math.max(max, el.y + el.height - 1), 0);
  const NUM_ROWS = maxY + 2; // Add 4 rows of "headroom"
  const NUM_COLS = 12

  const occupiedCells = getOccupiedCells(elements);

  return (
    <div className="p-4 w-full relative overflow-y-auto">
      <div className="relative">

        {/* Interactive Grid Layer (when placing a new component) */}
        {isPlacing && (
          <div
            className="absolute inset-0 z-10 grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${NUM_COLS}, 1fr)`,
              gridAutoRows: '80px',
              pointerEvents: 'auto',
            }}
          >
            {Array.from({ length: NUM_COLS * NUM_ROWS }).map((_, idx) => {
              const col = (idx % NUM_COLS) + 1
              const row = Math.floor(idx / NUM_COLS) + 1
              const isOccupied = occupiedCells.has(`${col},${row}`);

              return (
                <div
                  key={`${col}-${row}`}
                  className={cn(
                    "border border-dashed border-muted",
                    isOccupied
                      ? 'hover:bg-destructive hover:opacity-25 cursor-not-allowed'
                      : 'hover:bg-accent hover:opacity-50 cursor-pointer'
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (!isOccupied) onAddElementAtCell(col, row)}
                  }
                />
              )
            })}
          </div>
        )}

        {/* Canvas content grid */}
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${NUM_COLS}, 1fr)`,
            gridAutoRows: '80px',
          }}
        >
          {elements.map(el => {
            const isSelected = selectedElement?.id === el.id
            return (
              <div
                key={el.id}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onSelectElement(el)
                }}
                className={cn(
                  'p-2 rounded-md border text-sm transition-colors cursor-pointer',
                  'bg-card border-border',
                  isSelected
                    ? 'ring-2 ring-ring bg-accent text-accent-foreground'
                    : 'hover:bg-accent/40'
                )}
                style={{
                  gridColumn: `${el.x} / span ${el.width}`,
                  gridRow: `${el.y} / span ${el.height}`,
                }}
              >
                {renderElementContent(el)}
              </div>
            )
          })}
        </div>

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

export function getOccupiedCells(elements: Element[]): Set<string> {
  const cells = new Set<string>()

  for (const el of elements) {
    for (let x = el.x; x < el.x + el.width; x++) {
      for (let y = el.y; y < el.y + el.height; y++) {
        cells.add(`${x},${y}`)
      }
    }
  }

  return cells
}

export function canPlaceElementAt(
  col: number,
  row: number,
  width: number,
  height: number,
  elements: Element[],
  maxCols = 12
): boolean {
  if (col > maxCols) return false

  const occupied = getOccupiedCells(elements)

  for (let x = col; x < col + width && x <= maxCols; x++) {
    for (let y = row; y < row + height; y++) {
      if (occupied.has(`${x},${y}`)) {
        return false
      }
    }
  }

  return col + width - 1 <= maxCols
}

export function getBestFitSize(
  col: number,
  row: number,
  maxWidth: number,
  maxHeight: number,
  elements: Element[],
  maxCols = 12
): { width: number; height: number } | null {
  for (let w = maxWidth; w >= 1; w--) {
    for (let h = maxHeight; h >= 1; h--) {
      if (canPlaceElementAt(col, row, w, h, elements, maxCols)) {
        return { width: w, height: h };
      }
    }
  }
  return null;
}