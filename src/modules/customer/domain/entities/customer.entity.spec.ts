import { Customer } from './customer.entity';

describe('Customer entity', () => {
  function makeCustomer(): Customer {
    return Customer.create({ name: 'Test Customer', document: '123456789' });
  }

  describe('authorizeTransportType()', () => {
    it('adds a transport type id', () => {
      // Arrange
      const customer = makeCustomer();

      // Act
      customer.authorizeTransportType('tt-1');

      // Assert
      expect(customer.isTransportTypeAuthorized('tt-1')).toBe(true);
    });

    it('is idempotent — adding same id twice does not duplicate', () => {
      // Arrange
      const customer = makeCustomer();

      // Act
      customer.authorizeTransportType('tt-1');
      customer.authorizeTransportType('tt-1');

      // Assert
      expect(customer.authorizedTransportTypeIds).toHaveLength(1);
    });
  });

  describe('isTransportTypeAuthorized()', () => {
    it('returns true for authorized transport type', () => {
      // Arrange
      const customer = makeCustomer();
      customer.authorizeTransportType('tt-1');

      // Act & Assert
      expect(customer.isTransportTypeAuthorized('tt-1')).toBe(true);
    });

    it('returns false for unauthorized transport type', () => {
      // Arrange
      const customer = makeCustomer();

      // Act & Assert
      expect(customer.isTransportTypeAuthorized('tt-unknown')).toBe(false);
    });
  });
});
