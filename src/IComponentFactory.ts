import { IComponentInstance } from './IComponentInstance';

export interface IComponentFactory {
  attachComponent(entity: any, data?: any): IComponentInstance;
  deleteComponent?(component: IComponentInstance): void;
}
