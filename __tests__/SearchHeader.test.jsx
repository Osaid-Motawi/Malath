import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import SearchHeader from "../app/page/screens/components/SearchHeader";

describe("SearchHeader", () => {
  test("renders search input when search is active", () => {
    const setIsSearchActive = jest.fn();
    const setSearchQuery = jest.fn();

    const { getByPlaceholderText } = render(
      <SearchHeader
        isSearchActive={true}
        setIsSearchActive={setIsSearchActive}
        searchQuery=""
        setSearchQuery={setSearchQuery}
      />
    );

    expect(getByPlaceholderText("ابحث عن شاليه...")).toBeTruthy();
  });

  test("calls setSearchQuery when typing", () => {
    const setIsSearchActive = jest.fn();
    const setSearchQuery = jest.fn();

    const { getByPlaceholderText } = render(
      <SearchHeader
        isSearchActive={true}
        setIsSearchActive={setIsSearchActive}
        searchQuery=""
        setSearchQuery={setSearchQuery}
      />
    );

    const input = getByPlaceholderText("ابحث عن شاليه...");
    fireEvent.changeText(input, "رام الله");

    expect(setSearchQuery).toHaveBeenCalledWith("رام الله");
  });

  test("does not render input when search is not active", () => {
    const setIsSearchActive = jest.fn();
    const setSearchQuery = jest.fn();

    const { queryByPlaceholderText } = render(
      <SearchHeader
        isSearchActive={false}
        setIsSearchActive={setIsSearchActive}
        searchQuery=""
        setSearchQuery={setSearchQuery}
      />
    );

    expect(queryByPlaceholderText("ابحث عن شاليه...")).toBeNull();
  });
});