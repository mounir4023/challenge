import { Component } from '@/lib/types/component';
import React from 'react'
import ComponentCard from './component-card';

export default function ComponentsPanel({
  components,
  onSelectComponent,
  selectedComponent,
  onClose,
}: {
  components: Component[];
  onSelectComponent: (component: Component) => void;
  selectedComponent: Component | null;
  onClose?: () => void;
}) {
  return (
    <div className='p-4 h-full overflow-y-auto'>

      Components

      <ul className="space-y-1 mt-4">
        {components.map((component) => (
          <ComponentCard
            key={component.name}
            component={component}
            isSelected={selectedComponent?.name === component.name}
            onClick={() => {
              onSelectComponent(component);
              onClose?.();
            }}
          />
        ))}
      </ul>

    </div>
  )
}
