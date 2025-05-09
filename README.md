# React Modal Converted

A functional, accessible, and customizable modal component for React, inspired by the [jQuery Modal plugin](https://github.com/kylefox/jquery-modal). This component is designed to replace legacy jQuery modals in modern React applications, providing better performance, accessibility, and maintainability.

## Features

- Renders modal content using React Portal
- Closes on Escape key (configurable)
- Closes on overlay click (configurable)
- Optional "X" close button
- Closes when clicking any element with the `data-modal-close` attribute inside the modal
- Basic accessibility (role, aria-modal)
- Easily styleable with Tailwind CSS or your own CSS
- Fully unit tested with React Testing Library & Jest

## Installation

```bash
npm install <your-package-name>
# Or
yarn add <your-package-name>
```

> **Note:** You must have `react` and `react-dom` installed in your main project.

## Usage Example

```jsx
import React, { useState } from "react";
import ReactModalConverted from "<your-package-name>"; // Adjust import path

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
      <ReactModalConverted
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        escapeClose={true} // Close on Escape key (default: true)
        clickClose={true} // Close on overlay click (default: true)
        showClose={true} // Show the 'X' close button (default: true)
        overlayClassName="my-overlay" // Custom classes for overlay
        modalClassName="my-modal" // Custom classes for modal container
      >
        <h2 id="modal-title">Modal Title</h2>
        <p>This is the modal content.</p>
        {/* Any element with data-modal-close will close the modal */}
        <button data-modal-close>Close from inside</button>
      </ReactModalConverted>
    </div>
  );
}

export default App;
```

## Props

| Prop               | Type      | Default | Description                                                             |
| ------------------ | --------- | ------- | ----------------------------------------------------------------------- |
| `isOpen`           | boolean   | —       | Controls if the modal is visible. Required.                             |
| `onClose`          | function  | —       | Callback executed when the modal requests to be closed. Required.       |
| `children`         | ReactNode | —       | Content to display inside the modal. Required.                          |
| `escapeClose`      | boolean   | true    | If true, closes the modal on Escape key press.                          |
| `clickClose`       | boolean   | true    | If true, closes the modal when clicking the overlay.                    |
| `showClose`        | boolean   | true    | If true, displays the default 'X' close button in the top-right corner. |
| `overlayClassName` | string    | ""      | Additional classes for the overlay element.                             |
| `modalClassName`   | string    | ""      | Additional classes for the modal container.                             |

> **Tip:** Any element inside the modal with the attribute `data-modal-close` will close the modal when clicked.

## Accessibility

- The modal uses `role="dialog"` and `aria-modal="true"` for screen readers.
- You should set a unique `id` on your modal title and reference it with `aria-labelledby` if you want to improve accessibility further.
- For advanced focus management (focus trap), consider using a library like [focus-trap-react](https://github.com/focus-trap/focus-trap-react) or extending the component.

## Styling

- The component uses Tailwind CSS utility classes by default for layout and appearance.
- You can override or extend these styles using your own CSS or by customizing Tailwind in your project.

## Unit Testing

Unit tests are provided using Jest and React Testing Library. To run the tests:

```bash
npm test
```

## Migrating from jQuery Modal

This component is inspired by the [jQuery Modal plugin](https://github.com/kylefox/jquery-modal) but is fully written in React, with a functional and accessible API. Only the UI logic is ported; no jQuery or AJAX code is included.

## Changelog

- **1.0.0**: Initial release. Feature parity with basic jQuery Modal usage, plus accessibility and unit tests.

---

**For any questions or suggestions, please open an issue or pull request!**
