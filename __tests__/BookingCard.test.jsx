import { fireEvent, render } from "@testing-library/react-native";
import BookingCard from "../app/page/screens/components/BookingCard";

jest.mock("../app/page/screens/components/CustomIcon", () => ({
  CalendarIcon: () => null,
  UsersIcon: () => null,
}));

jest.mock("../app/page/screens/components/MiniCalendar", () => ({
  formatDisplay: (date) => date,
}));

describe("BookingCard", () => {
  const booking = {
    id: "b1",
    chaletId: "c1",
    userId: "u1",
    chaletName: "شاليه ملاذ",
    chaletImage: "https://test.com/image.jpg",
    checkIn: "2026-05-20",
    checkOut: "2026-05-22",
    guests: 4,
    totalPrice: 500,
    status: "pending",
  };

  test("renders chalet name", () => {
    const { getByText } = render(
      <BookingCard item={booking} onDelete={jest.fn()} />
    );

    expect(getByText("شاليه ملاذ")).toBeTruthy();
  });

  test("renders booking details", () => {
    const { getByText } = render(
      <BookingCard item={booking} onDelete={jest.fn()} />
    );

    expect(getByText("2026-05-20")).toBeTruthy();
    expect(getByText("2026-05-22")).toBeTruthy();
    expect(getByText("4 أشخاص")).toBeTruthy();
    expect(getByText("500 ₪")).toBeTruthy();
  });

  test("renders pending status badge", () => {
    const { getByText } = render(
      <BookingCard item={booking} onDelete={jest.fn()} />
    );

    expect(getByText("قيد الانتظار")).toBeTruthy();
  });

  test("calls onDelete when cancel button is pressed", () => {
    const onDelete = jest.fn();

    const { getByText } = render(
      <BookingCard item={booking} onDelete={onDelete} />
    );

    fireEvent.press(getByText("إلغاء الحجز"));

    expect(onDelete).toHaveBeenCalledWith("b1");
  });

  test("does not show cancel button when booking is confirmed", () => {
    const confirmedBooking = {
      ...booking,
      status: "confirmed",
    };

    const { queryByText } = render(
      <BookingCard item={confirmedBooking} onDelete={jest.fn()} />
    );

    expect(queryByText("إلغاء الحجز")).toBeNull();
  });
});