import React, { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ReactModalConvertedProps {
  isOpen: boolean; // Controls visibility
  onClose: () => void; // Function to call when closing
  children: ReactNode; // Content of the modal
  escapeClose?: boolean; // Close on Escape key (default: true)
  clickClose?: boolean; // Close on overlay click (default: true)
  showClose?: boolean; // Show the 'X' close button (default: true)
  overlayClassName?: string; // Additional classes for overlay
  modalClassName?: string; // Additional classes for modal container
  // We can add more props later based on jquery-modal options if needed
}

const ReactModalConverted: React.FC<ReactModalConvertedProps> = ({
  isOpen,
  onClose,
  children,
  escapeClose = true,
  clickClose = true,
  showClose = true,
  overlayClassName = "",
  modalClassName = "",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus automatically the close button when modal opens
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  // Handle Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (escapeClose && event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
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

  // Clean up portal root on unmount
  useEffect(() => {
    return () => {
      const portalRoot = document.getElementById("react-modal-converted-root");
      if (portalRoot) {
        portalRoot.remove();
      }
    };
  }, []);

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
      className={`fixed inset-0 z-9999 flex items-center justify-center bg-black/50 transition-opacity duration-300 ease-in-out ${overlayClassName}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true">
      {/* Modal Container */}
      <div
        ref={modalRef}
        className={`relative bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full transform transition-all duration-300 ease-in-out scale-95  animate-fade-in-scale ${modalClassName}`}
        onClick={(e) => e.stopPropagation()} // Prevent overlay click when clicking inside
      >
        {/* Close Button (rendered based on showClose) */}
        {showClose && (
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
            data-modal-close>
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
