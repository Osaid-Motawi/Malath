import { render } from "@testing-library/react-native";
import StatusBadge from "../app/page/screens/components/StatusBadge";

describe("StatusBadge", () => {

  test("renders pending status", () => {
    const { getByText } = render(
      <StatusBadge status="pending" />
    );

    expect(
      getByText("قيد الانتظار")
    ).toBeTruthy();
  });

  test("renders confirmed status", () => {
    const { getByText } = render(
      <StatusBadge status="confirmed" />
    );

    expect(
      getByText("مؤكد")
    ).toBeTruthy();
  });

  test("renders rejected status", () => {
    const { getByText } = render(
      <StatusBadge status="rejected" />
    );

    expect(
      getByText("مرفوض")
    ).toBeTruthy();
  });

});