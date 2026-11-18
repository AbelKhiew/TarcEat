# Fixed shared colours

Source of truth: styles/theme.css. Homepage and /style-guide demonstrate these styles.

| Token | Colour | Use |
| --- | --- | --- |
| --color-bg | #f5f5ef | Cream page background |
| --color-text | #153c36 | Dark green text/header |
| --color-primary | #215d4b | Primary buttons |
| --color-accent | #d9efaa | Light green hero/secondary actions |
| --color-muted | #64736b | Secondary text |
| --color-border | #dbe3da | Borders |
| --color-surface | #ffffff | Cards/fields |

Classes: page, panel, hero, grid, stack, button, button-secondary, field, notice,
notice-warning, notice-error, badge, data-table, muted and eyebrow.
Do not redefine palette tokens in member files. The team lead approves theme changes.
This fixes the palette and shared primitives, not the full screen layout; members build those.
