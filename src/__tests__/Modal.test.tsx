import { render, screen, fireEvent, cleanup } from "@testing-library/react";

import "@testing-library/jest-dom";
import React from "react";
import ReactModalConverted from "../Modal";

// Define partial props type for ease of setup
type Props = Partial<React.ComponentProps<typeof ReactModalConverted>>;
// Default modal content used across tests
const modalContent = <div>Contenu de la modale</div>;

/**
 * Renders the modal with default props and returns the onClose mock.
 */
const setup = (props: Props = {}, children = modalContent) => {
  const onClose = jest.fn();
  render(
    <ReactModalConverted onClose={onClose} isOpen={false} {...props}>
      {children}
    </ReactModalConverted>
  );
  return { onClose };
};

describe("ReactModalConverted", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("does not render when isOpen is false", () => {
      setup();
      expect(
        screen.queryByText("Contenu de la modale")
      ).not.toBeInTheDocument();
    });

    it("renders when isOpen is true", () => {
      setup({ isOpen: true });
      expect(screen.getByText("Contenu de la modale")).toBeInTheDocument();
    });
  });

  describe("Closing behavior", () => {
    describe("Overlay click", () => {
      it("closes when clickClose=true", () => {
        const { onClose } = setup({ isOpen: true, clickClose: true });
        fireEvent.click(screen.getByRole("dialog"));
        expect(onClose).toHaveBeenCalled();
      });

      it("does not close when clickClose=false", () => {
        const { onClose } = setup({ isOpen: true, clickClose: false });
        fireEvent.click(screen.getByRole("dialog"));
        expect(onClose).not.toHaveBeenCalled();
      });
    });

    describe("Close button", () => {
      it("closes when showClose=true", () => {
        const { onClose } = setup({ isOpen: true, showClose: true });
        fireEvent.click(screen.getByLabelText(/Close/i));
        expect(onClose).toHaveBeenCalled();
      });

      it("does not render the close button when showClose=false", () => {
        setup({ isOpen: true, showClose: false });
        expect(screen.queryByLabelText(/Close/i)).toBeNull();
      });
    });

    describe("Keyboard interaction", () => {
      it("closes on Escape when escapeClose=true", () => {
        const { onClose } = setup({ isOpen: true, escapeClose: true });
        fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
        expect(onClose).toHaveBeenCalled();
      });

      it("does not close on Escape when escapeClose=false", () => {
        const { onClose } = setup({ isOpen: true, escapeClose: false });
        fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
        expect(onClose).not.toHaveBeenCalled();
      });
    });

    describe("Data attribute close", () => {
      it("closes when clicking element with data-modal-close", () => {
        const { onClose } = setup(
          { isOpen: true },
          <button data-modal-close>Fermer</button>
        );
        fireEvent.click(screen.getByText("Fermer"));
        expect(onClose).toHaveBeenCalled();
      });
    });
  });

  describe("Accessibility", () => {
    it("has basic aria attributes", () => {
      setup({ isOpen: true });
      expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
    });
  });

  describe("Styling", () => {
    it("applies custom classes to overlay and modal", () => {
      setup({
        isOpen: true,
        overlayClassName: "my-overlay",
        modalClassName: "my-modal",
      });
      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("my-overlay");
      const contentElem = screen.getByText("Contenu de la modale");
      const wrapperDiv = contentElem.parentElement!;
      const modalContainer = wrapperDiv.parentElement!;
      expect(modalContainer).toHaveClass("my-modal");
    });
  });

  describe("Side effects", () => {
    it("restores body overflow style after close", () => {
      const onClose = jest.fn();
      const { rerender } = render(
        <ReactModalConverted isOpen={true} onClose={onClose}>
          {modalContent}
        </ReactModalConverted>
      );
      expect(document.body.style.overflow).toBe("hidden");
      rerender(
        <ReactModalConverted isOpen={false} onClose={onClose}>
          {modalContent}
        </ReactModalConverted>
      );
      expect(document.body.style.overflow).toBe("auto");
    });
  });
});
