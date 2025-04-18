import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

import "@testing-library/jest-dom";
import ReactModalConverted from "../Modal";

describe("ReactModalConverted", () => {
  const onClose = jest.fn();
  const modalContent = <div>Contenu de la modale</div>;

  afterEach(() => {
    jest.clearAllMocks();
    // Nettoyer le DOM du portal
    const portal = document.getElementById("react-modal-converted-root");
    if (portal) portal.remove();
  });

  it("n'affiche rien si isOpen est false", () => {
    render(
      <ReactModalConverted isOpen={false} onClose={onClose}>
        {modalContent}
      </ReactModalConverted>
    );
    expect(screen.queryByText("Contenu de la modale")).not.toBeInTheDocument();
  });

  it("affiche la modale si isOpen est true", () => {
    render(
      <ReactModalConverted isOpen={true} onClose={onClose}>
        {modalContent}
      </ReactModalConverted>
    );
    expect(screen.getByText("Contenu de la modale")).toBeInTheDocument();
  });

  it("ferme la modale quand on clique sur l'overlay si clickClose=true", () => {
    render(
      <ReactModalConverted isOpen={true} onClose={onClose} clickClose={true}>
        {modalContent}
      </ReactModalConverted>
    );
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalled();
  });

  it("ne ferme pas la modale quand on clique sur l'overlay si clickClose=false", () => {
    render(
      <ReactModalConverted isOpen={true} onClose={onClose} clickClose={false}>
        {modalContent}
      </ReactModalConverted>
    );
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("ferme la modale quand on clique sur le bouton X", () => {
    render(
      <ReactModalConverted isOpen={true} onClose={onClose} showClose={true}>
        {modalContent}
      </ReactModalConverted>
    );
    const closeButton = screen.getByLabelText(/close/i);
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  it("ferme la modale quand on appuie sur Echap si escapeClose=true", () => {
    render(
      <ReactModalConverted isOpen={true} onClose={onClose} escapeClose={true}>
        {modalContent}
      </ReactModalConverted>
    );
    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });

  it("ne ferme pas la modale quand on appuie sur Echap si escapeClose=false", () => {
    render(
      <ReactModalConverted isOpen={true} onClose={onClose} escapeClose={false}>
        {modalContent}
      </ReactModalConverted>
    );
    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("ferme la modale quand on clique sur un bouton avec data-modal-close", () => {
    render(
      <ReactModalConverted isOpen={true} onClose={onClose}>
        <button data-modal-close>Fermer</button>
      </ReactModalConverted>
    );
    const closeBtn = screen.getByText("Fermer");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it("a les attributs d'accessibilité de base", () => {
    render(
      <ReactModalConverted isOpen={true} onClose={onClose}>
        {modalContent}
      </ReactModalConverted>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });
});
