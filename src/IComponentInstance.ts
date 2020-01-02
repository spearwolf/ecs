import { Entity } from './Entity';

export interface IComponentInstance {
  connectToEntity?(entity: Entity): void;
  disconnectFromEntity?(entity: Entity): void;
  toJSON?(): any;
}
