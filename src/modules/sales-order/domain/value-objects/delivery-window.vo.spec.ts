import { DeliveryWindow } from './delivery-window.vo';

describe('DeliveryWindow value object', () => {
  it('creates successfully when startTime < endTime', () => {
    // Act
    const window = DeliveryWindow.create(new Date('2025-01-15'), '08:00', '12:00');

    // Assert
    expect(window.startTime).toBe('08:00');
    expect(window.endTime).toBe('12:00');
  });

  it('throws when startTime >= endTime', () => {
    // Act & Assert
    expect(() => DeliveryWindow.create(new Date('2025-01-15'), '12:00', '08:00')).toThrow(
      /startTime/,
    );
  });

  it('throws when startTime equals endTime', () => {
    // Act & Assert
    expect(() => DeliveryWindow.create(new Date('2025-01-15'), '10:00', '10:00')).toThrow(
      /startTime/,
    );
  });

  it('equals() returns true for same values', () => {
    // Arrange
    const date = new Date('2025-01-15');
    const a = DeliveryWindow.create(date, '09:00', '17:00');
    const b = DeliveryWindow.create(date, '09:00', '17:00');

    // Assert
    expect(a.equals(b)).toBe(true);
  });
});
