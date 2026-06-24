import { OrderNumber } from './order-number.vo';

describe('OrderNumber value object', () => {
  it('generates a valid order number matching OV-YYYYMMDD-XXXXX', () => {
    // Act
    const on = OrderNumber.generate();

    // Assert
    expect(on.value).toMatch(/^OV-\d{8}-\d{5}$/);
  });

  it('equals() returns true for same value', () => {
    // Arrange
    const a = OrderNumber.reconstitute('OV-20240101-00001');
    const b = OrderNumber.reconstitute('OV-20240101-00001');

    // Assert
    expect(a.equals(b)).toBe(true);
  });

  it('equals() returns false for different values', () => {
    // Arrange
    const a = OrderNumber.reconstitute('OV-20240101-00001');
    const b = OrderNumber.reconstitute('OV-20240101-00002');

    // Assert
    expect(a.equals(b)).toBe(false);
  });

  it('throws on invalid format', () => {
    // Act & Assert
    expect(() => OrderNumber.reconstitute('INVALID')).toThrow();
  });
});
