# Marketing Library

The library is a shared Readiness resource, supporting acquisition and customer progress. It contains two collections: **Assets** (reusable source images, logos, copy and references) and **Materials** (designs produced from linked assets). Neither is a customer qualification stage.

Reuse the workspace entity card, table, toolbar and nonmodal detail drawer. Each record has a title, category, language, format, status, version, original file, optional preview, owner and source notes. Materials reference existing asset identities; the reverse “Used in materials” list comes from the same relationship. Draft / Ready to use / Archived are shared states. A working design does not imply print approval.

Cards use an image preview or a format icon, compact metadata and visible status text. Original aspect ratios are preserved. Cards use small thumbnails; opening the preview loads the full image. Filters cover collection, category, language, format and status, with search and card/list views. Related files open through the shared drawer. Long forms and source selectors scroll; save errors preserve entered values. Narrow screens use two compact columns, then one below 360px.

The Overview displays actual material previews and counts from this library. Its Sales Materials column is bounded to 190px at desktop sizes; Acquisition remains the main flexible column, and target results are bounded to 310px. Global Alerts gives the map the flexible primary area and caps the adjacent signal list at 380px, with compact signal rows. Below 1000px map and list stack.

## Initial content, 13 September 2026

The current Playground Solution v07 banner is stored as a **PNG working preview**, linked to six existing source assets: Pisell white logo, generated playground scene, generated family visual, transparent horse PNG, English copy and AttractionX reference PDF. Generated visuals are labelled as illustrations, not customer photographs. The source PSD files stay local and are not uploaded, per the user's correction. Do not import rejected or superseded concepts as current materials.

## Applied UI guidance

Project-preserving `ui-ux-pro-max`: compact density, optimized thumbnails, preserved image proportions, responsive layouts, meaningful icons, visible status text alongside colour, keyboard focus, loading/progress/error feedback. The approved Pisell logo, palette, shared spacing and drawer behavior take precedence over generic styles.
