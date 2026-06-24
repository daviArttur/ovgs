import { CreateSalesOrderUseCase } from './create-sales-order.use-case';
import { AbstractCustomerRepository } from '@modules/customer/domain/repositories/abstract-customer.repository';
import { AbstractTransportTypeRepository } from '@modules/transport-type/domain/repositories/abstract-transport-type.repository';
import { AbstractItemRepository } from '@modules/item/domain/repositories/abstract-item.repository';
import { AbstractSalesOrderRepository } from '@modules/sales-order/domain/repositories/abstract-sales-order.repository';
import { EventBus } from '@shared/application/ports/event-bus.port';
import { Customer } from '@modules/customer/domain/entities/customer.entity';
import { TransportType } from '@modules/transport-type/domain/entities/transport-type.entity';
import { Item } from '@modules/item/domain/entities/item.entity';
import { CustomerNotFoundException } from '@modules/customer/domain/exceptions/customer-not-found.exception';
import { TransportTypeNotAuthorizedException } from '@modules/sales-order/domain/exceptions/transport-type-not-authorized.exception';
import { ItemNotFoundException } from '@modules/item/domain/exceptions/item-not-found.exception';
import { TransportTypeNotFoundException } from '@modules/transport-type/domain/exceptions/transport-type-not-found.exception';

describe('CreateSalesOrderUseCase', () => {
  let useCase: CreateSalesOrderUseCase;
  let customerRepo: jest.Mocked<AbstractCustomerRepository>;
  let transportTypeRepo: jest.Mocked<AbstractTransportTypeRepository>;
  let itemRepo: jest.Mocked<AbstractItemRepository>;
  let salesOrderRepo: jest.Mocked<AbstractSalesOrderRepository>;
  let eventBus: jest.Mocked<EventBus>;

  const transportTypeId = 'tt-1';
  const customerId = 'c-1';
  const itemId = 'item-1';

  beforeEach(() => {
    customerRepo = {
      findById: jest.fn(),
      findByDocument: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
    } as jest.Mocked<AbstractCustomerRepository>;

    transportTypeRepo = {
      findById: jest.fn(),
      findByName: jest.fn(),
      findAll: jest.fn(),
      existsById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<AbstractTransportTypeRepository>;

    itemRepo = {
      findById: jest.fn(),
      findBySku: jest.fn(),
      findAllByIds: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
    } as jest.Mocked<AbstractItemRepository>;

    salesOrderRepo = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
    } as jest.Mocked<AbstractSalesOrderRepository>;

    eventBus = {
      publish: jest.fn().mockResolvedValue(undefined),
    } as jest.Mocked<EventBus>;

    useCase = new CreateSalesOrderUseCase(
      customerRepo,
      transportTypeRepo,
      itemRepo,
      salesOrderRepo,
      eventBus,
    );
  });

  function makeCustomer(): Customer {
    const c = Customer.create({ name: 'Test', document: '123' });
    c.authorizeTransportType(transportTypeId);
    return c;
  }

  function makeTransportType(): TransportType {
    return TransportType.reconstitute(
      transportTypeId,
      { name: 'Road', description: null },
      new Date(),
      new Date(),
    );
  }

  function makeItem(): Item {
    return Item.reconstitute(
      itemId,
      { sku: 'SKU-1', name: 'Product', description: null },
      new Date(),
      new Date(),
    );
  }

  it('creates order successfully', async () => {
    // Arrange
    customerRepo.findById.mockResolvedValue(makeCustomer());
    transportTypeRepo.findById.mockResolvedValue(makeTransportType());
    itemRepo.findAllByIds.mockResolvedValue([makeItem()]);
    salesOrderRepo.save.mockResolvedValue(undefined);

    // Act
    const result = await useCase.execute({
      customerId,
      transportTypeId,
      items: [{ itemId, quantity: 2 }],
    });

    // Assert
    expect(result.customerId).toBe(customerId);
    expect(result.items).toHaveLength(1);
    expect(eventBus.publish).toHaveBeenCalled();
  });

  it('throws CustomerNotFoundException when customer not found', async () => {
    // Arrange
    customerRepo.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(
      useCase.execute({ customerId, transportTypeId, items: [{ itemId, quantity: 1 }] }),
    ).rejects.toThrow(CustomerNotFoundException);
  });

  it('throws TransportTypeNotFoundException when transport type not found', async () => {
    // Arrange
    customerRepo.findById.mockResolvedValue(makeCustomer());
    transportTypeRepo.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(
      useCase.execute({ customerId, transportTypeId, items: [{ itemId, quantity: 1 }] }),
    ).rejects.toThrow(TransportTypeNotFoundException);
  });

  it('throws TransportTypeNotAuthorizedException when not authorized', async () => {
    // Arrange
    const customer = Customer.create({ name: 'Test', document: '123' });
    customerRepo.findById.mockResolvedValue(customer);
    transportTypeRepo.findById.mockResolvedValue(makeTransportType());

    // Act & Assert
    await expect(
      useCase.execute({ customerId, transportTypeId, items: [{ itemId, quantity: 1 }] }),
    ).rejects.toThrow(TransportTypeNotAuthorizedException);
  });

  it('throws ItemNotFoundException when item not found', async () => {
    // Arrange
    customerRepo.findById.mockResolvedValue(makeCustomer());
    transportTypeRepo.findById.mockResolvedValue(makeTransportType());
    itemRepo.findAllByIds.mockResolvedValue([]);

    // Act & Assert
    await expect(
      useCase.execute({ customerId, transportTypeId, items: [{ itemId, quantity: 1 }] }),
    ).rejects.toThrow(ItemNotFoundException);
  });
});
