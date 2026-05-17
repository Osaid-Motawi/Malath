import { fireEvent, render } from "@testing-library/react-native";
import ChaletCard from "../app/page/screens/components/ChaletCard";

const mockPush = jest.fn();
const mockToggleFavorite = jest.fn();
const mockIsFavorite = jest.fn(() => false);

jest.mock("expo-router", () => ({
  router: {
    push: (...args) => mockPush(...args),
  },
}));

jest.mock("../app/page/screens/components/ChaletContext", () => ({
  useChalet: () => ({
    toggleFavorite: mockToggleFavorite,
    isFavorite: mockIsFavorite,
  }),
}));

jest.mock("../app/page/screens/components/CustomIcon", () => ({
  HeartIcon: () => null,
  PersonIcon: () => null,
}));

describe("ChaletCard", () => {
  const chalet = {
    id: "c1",
    name: "شاليه الورد",
    location: "نابلس",
    price: 300,
    rating: 4.8,
    capacity: 6,
    image: "https://test.com/chalet.jpg",
    discount: 20,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders chalet basic information", () => {
    const { getByText } = render(<ChaletCard chalet={chalet} />);

    expect(getByText("شاليه الورد")).toBeTruthy();
    expect(getByText("نابلس")).toBeTruthy();
    expect(getByText("300 ₪")).toBeTruthy();
    expect(getByText("6")).toBeTruthy();
    expect(getByText("4.8")).toBeTruthy();
  });

  test("renders discount badge and old price when discount exists", () => {
    const { getByText } = render(<ChaletCard chalet={chalet} />);

    expect(getByText(" خصم %20")).toBeTruthy();
    expect(getByText("375 ₪")).toBeTruthy();
  });

  test("calls onPress when card is pressed", () => {
    const onPress = jest.fn();

    const { getByText } = render(
      <ChaletCard chalet={chalet} onPress={onPress} />
    );

    fireEvent.press(getByText("شاليه الورد"));

    expect(onPress).toHaveBeenCalledWith(chalet);
  });

  test("navigates to chalet details when onPress is not provided", () => {
    const { getByText } = render(<ChaletCard chalet={chalet} />);

    fireEvent.press(getByText("شاليه الورد"));

    expect(mockPush).toHaveBeenCalledWith({
      pathname: "/chalet-details",
      params: { chaletId: "c1" },
    });
  });

  test("does not render discount badge when discount is zero", () => {
    const noDiscountChalet = {
      ...chalet,
      discount: 0,
    };

    const { queryByText } = render(<ChaletCard chalet={noDiscountChalet} />);

    expect(queryByText(" خصم %0")).toBeNull();
    expect(queryByText("375 ₪")).toBeNull();
  });
});