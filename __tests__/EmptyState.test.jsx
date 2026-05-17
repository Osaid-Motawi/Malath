import { fireEvent, render } from "@testing-library/react-native";
import EmptyState from "../app/page/screens/components/EmptyState";

describe("EmptyState", () => {
  test("renders default no_city state", () => {
    const { getByText } = render(<EmptyState />);

    expect(getByText("🏠")).toBeTruthy();
    expect(getByText("لا يوجد شاليهات  ")).toBeTruthy();
    expect(getByText(" لا توجد شاليهات مطابقة لهذا الفلتر حالياً")).toBeTruthy();
  });

  test("renders no_search state", () => {
    const { getByText } = render(<EmptyState type="no_search" />);

    expect(getByText("🔍")).toBeTruthy();
    expect(getByText("لا توجد نتائج")).toBeTruthy();
    expect(getByText("جرب كلمة بحث مختلفة أو اختر مدينة أخرى")).toBeTruthy();
  });

  test("renders error state", () => {
    const { getByText } = render(<EmptyState type="error" />);

    expect(getByText("⚠️")).toBeTruthy();
    expect(getByText("حدث خطأ")).toBeTruthy();
    expect(getByText("تعذر تحميل البيانات، تحقق من الاتصال")).toBeTruthy();
  });

  test("renders loading_failed state", () => {
    const { getByText } = render(<EmptyState type="loading_failed" />);

    expect(getByText("📡")).toBeTruthy();
    expect(getByText("لا يوجد اتصال")).toBeTruthy();
    expect(getByText("تحقق من الإنترنت وحاول مجدداً")).toBeTruthy();
  });

  test("does not render action button when onAction is not provided", () => {
    const { queryByText } = render(<EmptyState type="no_search" />);

    expect(queryByText("مسح البحث")).toBeNull();
  });

  test("calls onAction when action button is pressed", () => {
    const onAction = jest.fn();

    const { getByText } = render(
      <EmptyState type="no_search" onAction={onAction} />
    );

    fireEvent.press(getByText("مسح البحث"));

    expect(onAction).toHaveBeenCalled();
  });
});