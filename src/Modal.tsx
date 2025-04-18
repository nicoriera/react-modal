import React, { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ReactModalConvertedProps {
  isOpen: boolean; // Controls visibility
  onClose: () => void; // Function to call when closing
  children: ReactNode; // Content of the modal
  escapeClose?: boolean; // Close on Escape key (default: true)
  clickClose?: boolean; // Close on overlay click (default: true)
  showClose?: boolean; // Show the 'X' close button (default: true)
  // We can add more props later based on jquery-modal options if needed
}

const ReactModalConverted: React.FC<ReactModalConvertedProps> = ({
  isOpen,
  onClose,
  children,
  escapeClose = true,
  clickClose = true,
  showClose = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle Escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (escapeClose && event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Simple overflow hidden, jquery-modal might do more complex calculations
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      // Ensure scroll is restored if component unmounts while open
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose, escapeClose]);

  // Handle closing via elements with a specific attribute (like rel="modal:close")
  // We can achieve this by adding an onClick handler to the modal content wrapper
  // and checking the target element.
  useEffect(() => {
    const handleClickInside = (event: MouseEvent) => {
      // Check if the clicked element or its parent has the close attribute/class
      let target = event.target as HTMLElement | null;
      while (target && target !== modalRef.current) {
        // Using a data attribute for clarity instead of rel
        if (target.matches("[data-modal-close]")) {
          onClose();
          return;
        }
        target = target.parentElement;
      }
    };

    const modalElement = modalRef.current;
    if (isOpen && modalElement) {
      modalElement.addEventListener("click", handleClickInside);
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener("click", handleClickInside);
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  // Create portal target if it doesn't exist
  let portalRoot = document.getElementById("react-modal-converted-root");
  if (!portalRoot) {
    portalRoot = document.createElement("div");
    portalRoot.setAttribute("id", "react-modal-converted-root");
    document.body.appendChild(portalRoot);
  }

  const handleOverlayClick = () => {
    if (clickClose) {
      onClose();
    }
  };

  return createPortal(
    // Overlay ("blocker")
    <div
      className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true">
      {/* Modal Container */}
      <div
        ref={modalRef}
        className="relative bg-white p-6 rounded shadow-lg max-w-lg w-full overflow-y-auto max-h-[90vh]" // Basic styling
        onClick={(e) => e.stopPropagation()} // Prevent overlay click when clicking inside
      >
        {/* Close Button (rendered based on showClose) */}
        {showClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
            aria-label="Close"
            data-modal-close // Also allow this button to trigger close logic
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
        {/* Modal Content */}
        <div>{children}</div>
      </div>
    </div>,
    portalRoot
  );
};

export default ReactModalConverted;
