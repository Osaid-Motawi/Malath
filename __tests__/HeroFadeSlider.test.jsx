import { render } from "@testing-library/react-native";
import HeroFadeSlider from "../app/page/screens/components/HeroFadeSlider";

describe("HeroFadeSlider", () => {
  const slides = [
    {
      id: "1",
      name: "شاليه القدس",
      location: "رام الله",
      image: "https://test.com/image1.jpg",
    },
    {
      id: "2",
      name: "شاليه نابلس",
      location: "نابلس",
      image: "https://test.com/image2.jpg",
    },
  ];

  test("renders chalet name", () => {
    const { getByText } = render(<HeroFadeSlider slides={slides} />);

    expect(getByText(/شاليه/)).toBeTruthy();
  });

  test("renders location", () => {
    const { getAllByText } = render(<HeroFadeSlider slides={slides} />);

    expect(getAllByText(/رام الله|نابلس/).length).toBeGreaterThan(0);
  });

  test("renders featured text", () => {
    const { getByText } = render(<HeroFadeSlider slides={slides} />);

    expect(getByText("مختاراتنا المميزة")).toBeTruthy();
  });

  test("returns null when slides are empty", () => {
    const { queryByText } = render(<HeroFadeSlider slides={[]} />);

    expect(queryByText("مختاراتنا المميزة")).toBeNull();
  });
});