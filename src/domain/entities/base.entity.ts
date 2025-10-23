import { v4 } from 'uuid';
import { IEventBus } from '../events/IEventBus';
import { LogAction } from '../events/EventType';
import { getEventBus } from '../events';

type EntityChangeAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'BUILDED';

interface FieldDiff {
  oldValue: any;
  newValue: any;
}

export interface EntityChangeEvent {
  entityId: string;
  entityModel: string;
  action: EntityChangeAction;
  diff: Record<string, FieldDiff>;
  before?: Record<string, any>;
  after?: Record<string, any>;
}

abstract class EntityModel {
  public id: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public useTimestamps: boolean = true;
  abstract entityName: string;

  protected _dirty: boolean = false;
  protected _originalData: Record<string, any>;
  protected _lastAction: EntityChangeAction = 'BUILDED';

  constructor(data?: Record<string, any>) {
    this.id = data?.id;
    this._originalData = data ?? {};

    if (this.useTimestamps) {
      this.createdAt = data?.createdAt ? new Date(data.createdAt) : new Date();
      this.updatedAt = data?.updatedAt ? new Date(data.updatedAt) : new Date();
    }
  }

  public static build<T extends EntityModel>(
    this: new (data: any) => T,
    data: Partial<Omit<T, keyof EntityModel>> = {},
    entityId?: string | number,
  ): T {
    const subclassKeys = Object.keys(new this({}));
    const filteredData: Partial<T> = {};
    const rawData = data as Record<string, any>;

    for (const key of subclassKeys) {
      if (key in rawData) {
        filteredData[key as keyof T] = rawData[key];
      }
    }

    let id = v4();

    if (entityId) {
      id = String(entityId);
    }

    const finalData = { ...filteredData, id };

    return new this(finalData);
  }

  public markAsCreated(): void {
    this._lastAction = 'CREATE';
    this._dirty = true;
  }

  public markAsDeleted(): void {
    this._lastAction = 'DELETE';
    this._dirty = true;
  }

  public update(data: Partial<this>): void {
    if (data.createdAt || data.updatedAt) return;

    for (const key of Object.keys(data) as Array<keyof this>) {
      const newValue = data[key];
      const oldValue = this[key];

      const hasChanged =
        newValue instanceof Date && oldValue instanceof Date
          ? newValue.getTime() !== oldValue.getTime()
          : newValue !== oldValue;

      if (hasChanged) {
        (this[key] as any) = newValue;
        this._dirty = true;
      }
    }

    if (this._dirty && this.useTimestamps) {
      this.updatedAt = new Date();
    }

    this._lastAction = 'UPDATE';
  }

  private getPublicState(): Record<string, any> {
    const keys = this.getSubclassKeys();
    keys.push('id');

    if (this.useTimestamps) {
      keys.push(...['createdAt', 'updatedAt']);
    }

    const state: Record<string, any> = {};
    for (const key of keys) {
      state[key] = this[key as keyof this];
    }
    return state;
  }

  private getSubclassKeys(): string[] {
    class Temp extends EntityModel {
      entityName: string;
    }

    const baseKeys = Object.keys(new Temp({}));

    const instanceKeys = Object.keys(this);

    return instanceKeys.filter(
      (key) =>
        !baseKeys.includes(key) &&
        !key.startsWith('_') &&
        typeof (this as any)[key] !== 'function',
    );
  }

  public isDirty(): boolean {
    return this._dirty;
  }

  public clone<T extends this>(): T {
    const clone = new (this.constructor as any)(this._originalData) as T;

    clone._dirty = this._dirty;
    clone._lastAction = this._lastAction;
    clone.createdAt = this.createdAt;
    clone.updatedAt = this.updatedAt;
    clone.useTimestamps = this.useTimestamps;

    for (const key of this.getSubclassKeys()) {
      (clone as any)[key] = (this as any)[key];
    }

    return clone;
  }

  public toJSON() {
    const json = this.getPublicState();
    return json;
  }

  public async commit(): Promise<void> {
    if (!this._dirty) return;

    const before =
      this._lastAction === 'CREATE' ? undefined : this._originalData;
    const after =
      this._lastAction !== 'DELETE' ? this.getPublicState() : undefined;

    const diff: Record<string, FieldDiff> = {};

    if (before && after) {
      for (const key of Object.keys(after)) {
        const oldVal = before[key];
        const newVal = after[key];

        const isDifferent =
          oldVal instanceof Date && newVal instanceof Date
            ? oldVal.getTime() !== newVal.getTime()
            : oldVal !== newVal;

        if (isDifferent) {
          diff[key] = { oldValue: oldVal || null, newValue: newVal };
        }
      }
    } else if (after) {
      for (const key of Object.keys(after)) {
        diff[key] = { oldValue: null, newValue: after[key] };
      }
    } else if (before) {
      for (const key of Object.keys(before)) {
        diff[key] = { oldValue: before[key], newValue: null };
      }
    }

    const event: EntityChangeEvent = {
      action: this._lastAction,
      diff,
      before,
      after,
      entityModel: this.entityName,
      entityId: this.id,
    };

    this._dirty = false;
    this._originalData = after ?? {};

    await this.onChange(event);
  }

  protected async onChange(event: EntityChangeEvent): Promise<void> {
    const eventBus: IEventBus = getEventBus();

    await eventBus.publish({
      name: LogAction.CREATED,
      payload: {
        entityData: {
          key: event.entityId,
          name: event.entityModel,
        },
        data: {
          before: event.before,
          after: event.after,
        },
        action: event.action,
      },
    });
    //console.log(`[${this.constructor.name}] Event: ${event.action}`, JSON.stringify(event, null, 2))
  }
}

export default EntityModel;
