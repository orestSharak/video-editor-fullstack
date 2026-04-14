# Components Architecture & Naming Convention

To maintain a clear distinction between design system primitives and domain-specific logic, we follow a strict naming convention:

### 1. UI Primitives (shadcn/ui)
* **Convention:** `kebab-case`
* **Location:** `src/components/ui/`
* **Example:** `button.jsx`, `dialog-content.jsx`
* **Reason:** These are low-level, reusable atoms provided by our component library. We keep the original naming to stay consistent with the library's ecosystem.

### 2. Custom Business Components
* **Convention:** `PascalCase`
* **Location:** `src/components/` (outside `ui/`)
* **Example:** `Header.jsx`, `TimelineInfo.jsx`, `ClipItem.jsx`
* **Reason:** High-level components that contain business logic or specific layouts are named as React classes/functions to make them easily searchable and distinguishable in the IDE.