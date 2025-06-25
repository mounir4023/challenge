import React, { useEffect, useState } from 'react';
import { Element, Component, PropDefinition } from '@/lib/types/component';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ElementDialog({
  editingElement,
  component,
  setEditingElement,
}: {
  editingElement: Element | null;
  component: Component | undefined;
  setEditingElement: (el: Element | null) => void;
}) {
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (editingElement) {
      setFormValues(editingElement.props);
    }
  }, [editingElement]);

  if (!editingElement || !component) return null;

  function renderField(key: string, def: PropDefinition) {
    const value = formValues[key];

    switch (def.type) {
      case 'string':

        if (key === 'markdown') {
          return (
            <textarea
              value={value as string}
              onChange={(e) => setFormValues((prev) => ({ ...prev, [key]: e.target.value }))}
              className="w-full min-h-[120px] p-2 border border-input rounded-md resize-y text-sm font-mono bg-background"
            />
          );
        }

        return (
          <Input
            value={value as string}
            onChange={(e) => setFormValues((prev) => ({ ...prev, [key]: e.target.value }))}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={value as number}
            onChange={(e) => setFormValues((prev) => ({ ...prev, [key]: Number(e.target.value) }))}
          />
        );
      case 'boolean':
        return (
          <Checkbox
            checked={Boolean(value)}
            onCheckedChange={(v) => setFormValues((prev) => ({ ...prev, [key]: v }))}
          />
        );
      case 'select':
        return (
          <Select
            value={(value as string)?.toLocaleLowerCase() || ''}
            onValueChange={(v) => setFormValues((prev) => ({ ...prev, [key]: v }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {def.options?.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return <div>Unsupported prop type</div>;
    }
  }

  return (
    <Dialog open={!!editingElement} onOpenChange={() => setEditingElement(null)}>
      <DialogContent onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Edit {editingElement.type}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {Object.entries(component.props).map(([key, def]) => (
            <div key={key} className="space-y-1">
              <Label className="capitalize">{def.label || key}</Label>
              {renderField(key, def)}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setEditingElement(null);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setEditingElement({
                ...editingElement,
                props: formValues,
              });
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
