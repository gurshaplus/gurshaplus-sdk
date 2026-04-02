# GurshaPlus SDK 🤌

The official SDK for GurshaPlus. Easily integrate supporting and donations into your React, Next.js, or Vanilla JS applications.

## 🚀 Features

- **Lightweight**: Zero dependencies (only peer-dependency on React).
- **Production Ready**: Handles script loading, modal state, and payment polling.
- **Customizable**: Change emojis, labels, and widget positioning.
- **SSR Safe**: Designed for modern frameworks like Next.js.

## 📦 Installation

```bash
npm install @gurshaplus/sdk
# or
yarn add @gurshaplus/sdk
```

---

## 🛠️ Usage (React / Next.js)

The easiest way to integrate is using the `SupportButton` component. Use the `variant="popup"` for a centered dialog.

```tsx
import { SupportButton } from "@gurshaplus/sdk";

export default function MyPage() {
  return (
    <SupportButton 
      creator="daniel" 
      label="Support Me" 
      variant="popup"
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `creator` | `string` | **Required** | The GurshaPlus username. |
| `variant` | `"popup" \| "floating"` | `popup` for button, `floating` for provider | How the widget interacts. |
| `label` | `string` | `"Give a Gursha"` | The label for the button and modal. |
| `emoji` | `string` | `"🤌"` | The emoji displayed in the widget. |
| `position` | `"left" \| "right"` | `"right"` | Widget screen position. |
| `className` | `string` | `""` | Additional CSS classes for the button. |
| `style` | `object` | `{}` | Inline styles for the button. |

---

## ⚡ Usage (Vanilla JS / Manual)

If you aren't using React, you can still trigger the widget manually.

```javascript
import { loadGurshaScript } from "@gurshaplus/sdk";

async function handleSupport() {
  await loadGurshaScript();
  
  window.GurshaPlus.support({
    creator: "daniel",
    label: "Give a Gursha",
    emoji: "🎨"
  });
}
```

## 🔒 Security & Privacy

- Payments are handled securely via GurshaPlus providers.
- No sensitive user data is stored by the SDK.
- Support for private messages and visibility is built-in.

## 📄 License

MIT © [GurshaPlus](https://gurshaplus.com)
