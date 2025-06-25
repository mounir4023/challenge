'use client'

import BuilderCanvas, { getBestFitSize  } from '@/components/builder/builder-canvas'
import ComponentsPanel from '@/components/builder/components-panel'
import { Component, Element } from '@/lib/types/component';
import React, { useCallback, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';

export default function BuilderView({
  components,
  initialElements,
}: {
  components: Component[];
  initialElements: Element[];
}) {

  // Components selection
  const [isComponentsPanelOpen, setIsComponentsPanelOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const handleSelectComponent = useCallback((component: Component) => {
    setSelectedComponent(component);
    setSelectedElement(null);
  }, []);

  // Element placement
  const [elements, setElements] = useState<Element[]>(initialElements)
  const handleAddElement = (col: number, row: number) => {

    if (!selectedComponent) return

    const maxWidth = 3
    const maxHeight = 2

    // Can't place here
    const best = getBestFitSize(col, row, maxWidth, maxHeight, elements)
    if (!best) return

    // Build new element
    const defaultProps: Record<string, unknown> = {}
    for (const [key, def] of Object.entries(selectedComponent.props)) {
      defaultProps[key] = def.default
    }

    const newElement: Element = {
      id: crypto.randomUUID(),
      type: selectedComponent.name,
      props: defaultProps,
      width: best.width,
      height: best.height,
      x: col,
      y: row,
    }

    setElements(prev => [...prev, newElement])
    setSelectedComponent(null)
  }

  // Element Selection
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const handleSelectElement = useCallback((element: Element) => {
    setSelectedElement(element);
    setSelectedComponent(null)
  }, []);

  // Reset mode
  function resetMode() {
    setSelectedComponent(null)
    setSelectedElement(null)
  }
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        resetMode()
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedComponent, selectedElement]);

  // Element moving
  const isMoving = selectedElement !== null && selectedComponent === null;
  const handleMoveElement = (col: number, row: number) => {
    if (!selectedElement) return;
    const best = getBestFitSize(
      col, row,
      selectedElement.width,
      selectedElement.height,
      elements.filter(e => e.id !== selectedElement.id) // exclude self
    );
    if (!best) return;

    const moved = { ...selectedElement, x: col, y: row, width: best.width, height: best.height };
    setElements(prev => prev.map(e => e.id === moved.id ? moved : e));
    setSelectedElement(null);
  }

  // Element resizing
  function handleResizeElement(updated: Element) {
    setElements(prev =>
      prev.map(el => (el.id === updated.id ? updated : el))
    );
  }

  return (
    <div
      className='h-full w-full overflow-hidden relative flex justify-start items-stretch'
      onClick={(e) => {
        if (!e.defaultPrevented) resetMode();
      }}
    >


      {/* Backdrop area behind the components panel on small screens to dismiss panel */}
      {isComponentsPanelOpen && (
        <div
          className="absolute z-40 inset-0 bg-black/20 dark:bg-white/20 lg:hidden"
          onClick={() => setIsComponentsPanelOpen(false)}
        />
      )}

      {/* Components panel show button on small screens */}
      <div className="absolute top-4 left-4 z-50 lg:hidden">
        {!isComponentsPanelOpen && (
          <Button
            size="icon"
            variant="ghost"
            className="
              text-foreground bg-background hover:bg-muted hover:text-foreground
              cursor-pointer transition-colors px-3 h-8"
            onClick={() => setIsComponentsPanelOpen(true)}
          >
            <MenuIcon className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Components Panel, fixed on large screens, open/close drawer on small screens */}
      <aside
        className={`
          flex flex-col h-full
          ${isComponentsPanelOpen ? 'absolute z-50 w-[90vw] max-w-[240px] bg-background border-r ' : 'hidden'}
          lg:block lg:relative lg:z-0 lg:w-[240px] lg:shrink-0 lg:border-r lg:bg-sidebar-background
        `}
      >

        <ComponentsPanel
          components={components}
          onSelectComponent={(component) => {
            handleSelectComponent(component);
            setIsComponentsPanelOpen(false);
          }}
          onClose={() => setIsComponentsPanelOpen(false)}
          selectedComponent={selectedComponent}
        />

      </aside>


      {/* Page elements canvas */}
      <BuilderCanvas
        elements={elements}
        onSelectElement={handleSelectElement}
        selectedElement={selectedElement}
        isPlacing={selectedComponent !== null}
        onAddElementAtCell={handleAddElement}
        isMoving={isMoving}
        onMoveElementToCell={handleMoveElement}
        onResizeElement={handleResizeElement}
      />


    </div>
  )
}
