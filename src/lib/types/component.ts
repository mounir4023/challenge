
// Props schema for component attributes
export interface PropDefinition {
  label: string;
  type: 'string' | 'number' | 'select' | 'boolean';
  default: unknown;
  options?: string[]; // only for select
}

// A reusable component definition
export interface Component {
  name: string;
  props: Record<string, PropDefinition>;
}

// An instance of a component placed on the canvas
export interface Element {
  id: string;
  type: string ; // references Component.name
  props: Record<string, unknown>;

  // Canvas layout info (not part of the component definition)
  width: number;  // how many columns to span
  height: number; // how many rows to span
  x: number;    // grid column start (1–12)
  y: number;    // grid row start (1+)
}