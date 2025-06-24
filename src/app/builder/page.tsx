import BuilderView from '@/components/builder/view';
import { Component, Element } from '@/lib/types/component';

export default function BuilderPage() {

  // Reusable Components Library
  const components: Component[] = [
    {
      name: 'Text',
      props: {
        markdown: {
          label: 'Markdown',
          type: 'string',
          default: '## Hello world!',
        },
      },
    },
    {
      name: 'Image',
      props: {
        url: {
          label: 'URL',
          type: 'string',
          default: 'https://placehold.co/600x400',
        },
        sizing: {
          label: 'Sizing',
          type: 'select',
          default: 'contain',
          options: ['contain', 'cover']
        }
      },
    },
  ];

  // Mock Elements
  const elements: Element[] = [
    {
      id: 'el1',
      type: 'Text',
      props: { markdown: '## Hello, canvas!' },
      width: 6,
      height: 1,
    },
    {
      id: 'el2',
      type: 'Image',
      props: {
        url: 'https://placehold.co/400x300',
        sizing: 'Cover',
      },
      width: 6,
      height: 3,
    },
  ];

  return (
    <BuilderView
      components={components}
      elements={elements}
    />

  )
}
