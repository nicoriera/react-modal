import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import ReactModalConverted from "../Modal";

const meta: Meta<typeof ReactModalConverted> = {
  title: "Components/Modal",
  component: ReactModalConverted,
  argTypes: {
    isOpen: {
      control: "boolean",
      defaultValue: false,
      description: "Whether the modal is open",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    escapeClose: {
      control: "boolean",
      defaultValue: true,
      description: "Whether the modal can be closed by pressing the escape key",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    clickClose: {
      control: "boolean",
      defaultValue: true,
      description:
        "Whether the modal can be closed by clicking outside the modal",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    showClose: {
      control: "boolean",
      defaultValue: true,
      description: "Whether the modal has a close button",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    overlayClassName: {
      control: "text",
      defaultValue: "",
      description: "Custom CSS classes for the overlay",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: '""' },
      },
    },
    modalClassName: {
      control: "text",
      defaultValue: "",
      description: "Custom CSS classes for the modal container",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: '""' },
      },
    },
  },
  args: {
    isOpen: false,
    escapeClose: true,
    clickClose: true,
    showClose: true,
    overlayClassName: "",
    modalClassName: "",
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "The Modal component renders a portal-based dialog with customizable overlay and container styling.",
      },
    },
  },
} as Meta<typeof ReactModalConverted>;

export default meta;
type Story = StoryObj<typeof ReactModalConverted>;

export const Default: Story = {
  args: {
    ...meta.args,
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

export const WithoutCloseButton: Story = {
  args: { ...Default.args, showClose: false },
  parameters: {
    docs: { description: { story: "Modal without the default close button" } },
  },
  render: Default.render,
};

export const NoOverlayClose: Story = {
  args: { ...Default.args, clickClose: false },
  parameters: {
    docs: { description: { story: "Overlay click will not close the modal" } },
  },
  render: Default.render,
};

export const NoEscapeClose: Story = {
  args: { ...Default.args, escapeClose: false },
  parameters: {
    docs: { description: { story: "Escape key will not close the modal" } },
  },
  render: Default.render,
};

export const CustomStyling: Story = {
  args: {
    ...Default.args,
    overlayClassName: "bg-blue-500 bg-opacity-30",
    modalClassName: "max-w-md p-8",
  },
  parameters: {
    docs: {
      description: { story: "Custom styled overlay and modal container" },
    },
  },
  render: Default.render,
};
