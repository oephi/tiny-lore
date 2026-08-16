import { config, fields, collection } from '@keystatic/core';

const isProd = typeof process !== 'undefined' && process.env.NODE_ENV === 'production';

export default config({
  storage: isProd
    ? {
        kind: 'github',
        repo: 'oephi/tiny-lore',
      }
    : { kind: 'local' },
  collections: {
    constellations: collection({
      label: 'Constellations',
      slugField: 'name',
      path: 'src/content/constellations/*',
      format: { contentField: 'content' },
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        subtitle: fields.text({ label: 'Subtitle' }),
        color: fields.text({ label: 'Color (hex)', defaultValue: '#c9a84c' }),
        center: fields.object({
          x: fields.integer({ label: 'X', defaultValue: 0 }),
          y: fields.integer({ label: 'Y', defaultValue: 0 }),
        }, { label: 'World Position', description: 'Use the visual editor at /editor to set this.' }),
        stars: fields.array(
          fields.object({
            x: fields.integer({ label: 'X' }),
            y: fields.integer({ label: 'Y' }),
          }),
          {
            label: 'Stars',
            description: 'Star coordinates relative to center. Use the visual editor at /editor.',
            itemLabel: (props) => `(${props.fields.x.value}, ${props.fields.y.value})`,
          },
        ),
        lines: fields.array(
          fields.object({
            from: fields.integer({ label: 'From Star Index' }),
            to: fields.integer({ label: 'To Star Index' }),
          }),
          {
            label: 'Lines',
            description: 'Connections between stars by index. Use the visual editor at /editor.',
            itemLabel: (props) => `${props.fields.from.value} → ${props.fields.to.value}`,
          },
        ),
        content: fields.mdx({
          label: 'Story',
          extension: 'md',
        }),
      },
    }),
  },
});
