import { CreateCustomerUseCase } from './create-customer.use-case';
import { AbstractCustomerRepository } from '@modules/customer/domain/repositories/abstract-customer.repository';
import { Customer } from '@modules/customer/domain/entities/customer.entity';
import { DuplicateDocumentException } from '@modules/customer/domain/exceptions/duplicate-document.exception';

describe('CreateCustomerUseCase', () => {
  let useCase: CreateCustomerUseCase;
  let repo: jest.Mocked<AbstractCustomerRepository>;

  beforeEach(() => {
    repo = {
      findById: jest.fn(),
      findByDocument: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
    } as jest.Mocked<AbstractCustomerRepository>;

    useCase = new CreateCustomerUseCase(repo);
  });

  it('creates a customer successfully', async () => {
    // Arrange
    repo.findByDocument.mockResolvedValue(null);
    repo.save.mockResolvedValue(undefined);

    // Act
    const result = await useCase.execute({ name: 'John Doe', document: '123456789' });

    // Assert
    expect(result.name).toBe('John Doe');
    expect(result.document).toBe('123456789');
    expect(repo.save).toHaveBeenCalled();
  });

  it('throws DuplicateDocumentException when document already exists', async () => {
    // Arrange
    const existing = Customer.create({ name: 'Existing', document: '123456789' });
    repo.findByDocument.mockResolvedValue(existing);

    // Act & Assert
    await expect(
      useCase.execute({ name: 'New Customer', document: '123456789' }),
    ).rejects.toThrow(DuplicateDocumentException);
    expect(repo.save).not.toHaveBeenCalled();
  });
});
