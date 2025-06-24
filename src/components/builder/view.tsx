'use client'

import BuilderCanvas from '@/components/builder/builder-canvas'
import ComponentsPanel from '@/components/builder/components-panel'
import { Component, Element } from '@/lib/types/component';
import React, { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';

export default function BuilderView({
  components,
  elements,
}: {
  components: Component[];
  elements: Element[];
}) {

  // Components selection
  const [isComponentsPanelOpen, setIsComponentsPanelOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const handleSelectComponent = useCallback((component: Component) => {
    setSelectedComponent(component);
  }, []);

  // Element Selection
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const handleSelectElement = useCallback((element: Element) => {
    setSelectedElement(element);
  }, []);


  return (
    <div className='h-full w-full overflow-hidden relative flex justify-start items-stretch'>


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
      />

    </div>
  )
}
