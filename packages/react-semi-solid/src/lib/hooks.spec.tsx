import "core-js/stable/structured-clone";
import React, { useCallback, useEffect } from "react";
import { createSignal } from "semi-solid-core";
import { renderHook, render, screen, fireEvent } from "@testing-library/react";
import { useSignal } from "./hooks";
import "@testing-library/jest-dom";

describe("useSignal", () => {
  it("should render after setting", () => {
    const nameSignal = createSignal("Bob");
    const Component = () => {
      const [name, setName] = useSignal(nameSignal);

      useEffect(() => {
        setName("Alice");
      }, []);

      return <div>{name()}</div>;
    };

    const { getByText } = render(<Component />);

    expect(getByText("Alice")).toBeInTheDocument();
  });

  it("should compute derived values correctly", () => {
    const nameSignal = createSignal("Bob");
    const Component = () => {
      const [name, setName] = useSignal(nameSignal);

      useEffect(() => {
        setName("Alice");
      }, []);

      const greeting = () => `Hello ${name()}`;

      return <div>{greeting()}</div>;
    };

    const { getByText } = render(<Component />);

    expect(getByText("Hello Alice")).toBeInTheDocument();
  });
});
