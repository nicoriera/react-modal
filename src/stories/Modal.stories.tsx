import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import ReactModalConverted from "../Modal";

const meta: Meta<typeof ReactModalConverted> = {
  title: "Components/Modal",
  component: ReactModalConverted,
};

export default meta;

type Story = StoryObj<typeof ReactModalConverted>;

export const Default: Story = {
  args: {
    isOpen: false,
    escapeClose: true,
    clickClose: true,
    showClose: true,
    overlayClassName: "",
    modalClassName: "",
    children: (
      <>
        <h2>Modal Title</h2>
        <p>This is the modal content.</p>
        <button data-modal-close>Close from inside</button>
      </>
    ),
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);
    return (
      <>
        <button onClick={() => setIsOpen(true)}>Open Modal</button>
        <ReactModalConverted
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}>
          {args.children}
        </ReactModalConverted>
      </>
    );
  },
};
