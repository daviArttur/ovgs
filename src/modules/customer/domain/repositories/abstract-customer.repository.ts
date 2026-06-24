import { Customer } from '../entities/customer.entity';

export abstract class AbstractCustomerRepository {
  abstract findById(id: string): Promise<Customer | null>;
  abstract findByDocument(document: string): Promise<Customer | null>;
  abstract findAll(): Promise<Customer[]>;
  abstract save(customer: Customer): Promise<void>;
}
