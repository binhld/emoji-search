import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

describe("National rescue coordination dashboard", () => {
  it("renders header and key sections", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    ReactDOM.render(<App />, container);

    expect(container.querySelector("h1").textContent).toMatch(
      /Bản đồ nhiệt & Điều phối cứu hộ quốc gia/i
    );
    expect(container.querySelector("h2").textContent).toMatch(/Bản đồ nhiệt/i);
    expect(container.textContent).toContain("Danh sách sự cố");

    ReactDOM.unmountComponentAtNode(container);
    container.remove();
  });

  it("renders incident table with dispatch actions", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    ReactDOM.render(<App />, container);

    const table = container.querySelector("table");
    expect(table).not.toBeNull();
    expect(table.textContent).toContain("Lũ quét Sa Pa");
    const dispatchButton = container.querySelector("button.dispatch");
    expect(dispatchButton).not.toBeNull();

    ReactDOM.unmountComponentAtNode(container);
    container.remove();
  });
});
