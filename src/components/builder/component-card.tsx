import { Component } from '@/lib/types/component';
import { cn } from '@/lib/utils';
import { Crosshair, Plus } from 'lucide-react';
import React from 'react'

export default function ComponentCard({
  component,
  isSelected,
  onClick
}: {
  component: Component;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (

    <div
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }}
      className={cn(
        'cursor-pointer rounded-lg py-4 px-4 text-[11px] border-1',
        'group',
        isSelected
          ? 'border-border bg-accent'
          : 'hover:bg-accent/50'
      )}
    >

      <div className="flex justify-between items-center">

        <span className={cn(
          'text-[11px] font-semibold text-muted-foreground uppercase',
          isSelected ? 'text-accent-foreground' : 'text-muted-foreground'
        )}>
          {component.name}
        </span>

        {isSelected?
          <Crosshair className="size-4 shrink-0 text-primary" />
          :
          <Plus className="size-4 shrink-0 text-accent-forground group-hover:text-primary" />
        }
      </div>

    </div>
  )
}
