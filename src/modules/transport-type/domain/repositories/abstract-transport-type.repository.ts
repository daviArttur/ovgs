import { TransportType } from '../entities/transport-type.entity';

export abstract class AbstractTransportTypeRepository {
  abstract findById(id: string): Promise<TransportType | null>;
  abstract findByName(name: string): Promise<TransportType | null>;
  abstract findAll(): Promise<TransportType[]>;
  abstract existsById(id: string): Promise<boolean>;
  abstract save(transportType: TransportType): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
