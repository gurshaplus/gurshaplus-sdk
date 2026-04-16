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
      creator="gurshaplus" 
      variant="popup" // Required: 'popup' or 'floating'
      label="Support Me" 
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `creator` | `string` | **Required** | The GurshaPlus username. |
| `variant` | `"popup" \| "floating"` | **Required** | How the widget interacts. |
| `label` | `string` | `"Give a Gursha"` | The label for the button and modal. |
| `emoji` | `string` | `"🤌"` | The emoji displayed in the widget. |
| `position` | `"left" \| "right"` | `"right"` | Widget screen position. |
| `className` | `string` | `""` | Additional CSS classes for the button. |
| `style` | `object` | `{}` | Inline styles for the button. |
| `onSuccess` | `(data: { status: string, donationId: string, donation: object }) => void` | `undefined` | Called when a donation completes successfully. |
| `onFailed` | `(data: { status: string, message: string }) => void` | `undefined` | Called when a donation fails or errors. |

---

## ⚡ Usage (Vanilla JS / Manual)

If you aren't using React, you can still trigger the widget manually.

```javascript
import { loadGurshaScript } from "@gurshaplus/sdk";

async function handleSupport() {
  await loadGurshaScript();
  
  window.GurshaPlus.support({
    creator: "gurshaplus",
    label: "Give a Gursha",
    emoji: "🎨"
  });
}
```

## 🔒 Security & Privacy

- Payments are handled securely via GurshaPlus providers.
- No sensitive user data is stored by the SDK.
- Support for private messages and visibility is built-in.

## 📝 Changelog

### v1.1.0
- **Callback Support**: `GurshaPlus.support()` now accepts `onSuccess` and `onFailed` callback options. These fire when a donation completes or fails, receiving a payload with donation details.
  - `onSuccess({ status, donationId, donation })` — called on successful payment confirmation.
  - `onFailed({ status, message })` — called when payment fails or errors.
- **PostMessage Events**: The widget now emits structured `postMessage` events to parent frames for iframe/embed integrations:
  - `gursha-ready` — widget is initialized and rendered.
  - `gursha-open` / `gursha-close` — modal open/close state changes.
  - `gursha-success` — payment succeeded, includes `donationId` and `donation` data.
  - `gursha-failed` — payment failed, includes error `message`.

### v1.0.9
- **Iframe Bridge Architecture**: SDK now natively bypasses third-party CORS restrictions by running the widget via a deeply integrated iframe.
- **Improved SSR Compatibility**: Resolved a `window is not defined` crash in Next.js when rendering as a Server Component.
- **Fluid Layout**: Resolved widget layout truncation by delegating overlay animations cleanly within the iframe context.

### v1.0.8
- Initial release featuring strict `variant` checks and robust payload handling.

## 📄 License

MIT © [GurshaPlus](https://gurshaplus.com)
