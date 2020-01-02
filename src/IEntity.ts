import { Eventize } from '@spearwolf/eventize';
import { ECS } from './ECS';

export interface IEntity extends Eventize {

  // static $connectComponent = 'connectComponent';
  // static $destroyComponent = 'destroyComponent';
  // static $toJSON = 'toJSON';

  readonly id: string;
  readonly ecs: ECS;
}
