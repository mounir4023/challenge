/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { Component, Element } from '@/lib/types/component'
import { cn } from '@/lib/utils'
import { Scaling, Settings } from 'lucide-react'
import ElementDialog from './element-dialog'

export default function BuilderCanvas({
  elements,
  components,
  onSelectElement,
  selectedElement,
  isPlacing,
  onAddElementAtCell,
  isMoving,
  onMoveElementToCell,
  onUpdateElement,
  onDeleteElement
}: {
  elements: Element[]
  components: Component[]
  onSelectElement: (element: Element) => void
  selectedElement: Element | null
  isPlacing: boolean
  onAddElementAtCell: (col: number, row: number) => void
  isMoving: boolean
  onMoveElementToCell: (col: number, row: number) => void
  onUpdateElement: (element: Element) => void
  onDeleteElement: (id: string) => void;
}) {

  // Grid setup
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const maxY = elements.reduce((max, el) => Math.max(max, el.y + el.height - 1), 0);
  const NUM_ROWS = maxY + 4; // Add 4 rows of "headroom"
  const NUM_COLS = 12

  const occupiedCells = getOccupiedCells(elements);

  // Element editing
  const [editingElement, setEditingElement] = useState<Element | null>(null)
  const handleEditElement = (el: Element | null) => {
    if (el) {
      onUpdateElement(el);
    }
    setEditingElement(null);
  }

  // Element deleting
  const handleDeleteElement = (id: string ) => {
    onDeleteElement(id);
    setEditingElement(null);
  }

  // Element resizing
  const [resizeTarget, setResizeTarget] = useState<{
    id: string;
    baseWidth: number;
    baseHeight: number;
    startX: number;
    startY: number;
  } | null>(null);
  function startResizing(el: Element, mouseX: number, mouseY: number) {
    setResizeTarget({
      id: el.id,
      baseWidth: el.width,
      baseHeight: el.height,
      startX: mouseX,
      startY: mouseY,
    });
  }
  const [resizingPreview, setResizingPreview] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    valid: boolean;
  } | null>(null);
  useEffect(() => {
    if (!resizeTarget) return;

    function onMove(e: MouseEvent) {
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      const relX = e.clientX - canvasRect.left;
      const relY = e.clientY - canvasRect.top;

      const col = Math.floor(relX / 80) + 1;
      const row = Math.floor(relY / 80) + 1;

      const element = elements.find(el => el.id === resizeTarget?.id);
      if (!element) return;

      const newWidth = Math.max(1, col - element.x + 1);
      const newHeight = Math.max(1, row - element.y + 1);

      const valid = canPlaceElementAt(
        element.x,
        element.y,
        newWidth,
        newHeight,
        elements.filter(e => e.id !== element.id)
      );

      setResizingPreview({
        x: element.x,
        y: element.y,
        width: newWidth,
        height: newHeight,
        valid,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function onUp(e: MouseEvent) {
      if (resizingPreview && resizingPreview.valid) {
        const element = elements.find(el => el.id === resizeTarget?.id);
        if (element) {
          onUpdateElement({
            ...element,
            width: resizingPreview.width,
            height: resizingPreview.height,
          });
        }
      }

      setResizingPreview(null);
      setResizeTarget(null);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [resizeTarget, resizingPreview, elements, onUpdateElement]);

  return (
    <div className="p-4 w-full relative overflow-y-auto">
      <div ref={canvasRef} className="relative">

        {/* Interactive Grid Layer (when placing a new component) */}
        { (isPlacing || isMoving) && (
          <div
            className="absolute inset-0 z-10 grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${NUM_COLS}, 1fr)`,
              gridAutoRows: '80px',
              pointerEvents: 'auto',
            }}
          >
            {/* Grid cells listening to placement events */}
            {Array.from({ length: NUM_COLS * NUM_ROWS }).map((_, idx) => {

              const col = (idx % NUM_COLS) + 1
              const row = Math.floor(idx / NUM_COLS) + 1

              const isValid =
                isPlacing
                  ? !occupiedCells.has(`${col},${row}`)
                  : isMoving
                    ? resizeTarget && resizingPreview
                      ? resizingPreview.valid
                      : canPlaceElementAt(col, row, selectedElement?.width ?? 1, selectedElement?.height ?? 1, elements.filter(e => e.id !== selectedElement?.id))
                  : false;

              const isInteractive = isPlacing || isMoving;

              return (
                <div
                  key={`${col}-${row}`}
                  className={cn(
                    "border border-dashed border-muted",
                    isInteractive && !isValid && 'hover:bg-destructive hover:opacity-25 cursor-not-allowed',
                    isInteractive && isValid && 'hover:bg-accent hover:opacity-50 cursor-pointer'
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (isPlacing && isValid) onAddElementAtCell(col, row)
                    if (isMoving && isValid) onMoveElementToCell(col, row)
                  }}
                />
              )
            })}

            {/* Resized element preview */}
            {resizingPreview && (
              <div
                className={cn(
                  'z-30 border border-dashed rounded-sm',
                  resizingPreview.valid
                    ? 'border-info bg-info opacity-30'
                    : 'border-destructive bg-destructive opacity-10'
                )}
                style={{
                  gridColumn: `${resizingPreview.x} / span ${resizingPreview.width}`,
                  gridRow: `${resizingPreview.y} / span ${resizingPreview.height}`,
                }}
              />
            )}

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

          {/* Element cards */}
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
                  'relative',
                  'p-2 rounded-md border text-sm transition-colors cursor-pointer',
                  'bg-card border-border',
                  isSelected
                    ? 'ring-2 ring-ring bg-accent text-accent-foreground cursor-move'
                    : 'hover:bg-accent/40 cursor-pointer'
                )}
                style={{
                  gridColumn: `${el.x} / span ${el.width}`,
                  gridRow: `${el.y} / span ${el.height}`,
                }}
              >

                {/* Render element */}
                {renderElementContent(el)}

                {/* Edit element props */}
                {isSelected && (
                  <div
                    className="absolute top-1 right-1 p-1 bg-ring rounded-sm cursor-pointer z-20"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setEditingElement(el)
                    }}
                  >
                    <Settings className="size-6 text-muted"/>
                  </div>
                )}

                {/* Resize triggers */}
                {isSelected && (
                  <div
                    className="absolute bottom-1 right-1 p-1 bg-ring rounded-sm cursor-resize z-20"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      startResizing(el, e.clientX, e.clientY);
                    }}
                  >
                    <Scaling className="size-6 text-muted"/>
                  </div>
                )}

              </div>
            )
          })}
        </div>

        {/* Edit element dialog*/}
        <ElementDialog
          editingElement={editingElement}
          onDeleteElement={handleDeleteElement}
          setEditingElement={handleEditElement}
          component={components.find(c => c.name === editingElement?.type)}
        />


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