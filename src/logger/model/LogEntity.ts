import EntityModel from '../../domain/entities/base.entity';

export enum LogAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  QUERY = 'QUERY',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

export class LogEntity extends EntityModel {
  public entityName: string = 'LogEntity';

  public userId: string;
  public userData: Record<string, any>;
  public entityModel?: string;
  public entityId?: string;
  public action: LogAction;
  public before: Record<string, any>;
  public after: Record<string, any>;

  constructor(data: Record<string, any>) {
    super(data);
    this.userId = data.userId;
    this.userData = data.userData;
    this.entityId = data.entityId;
    this.entityModel = data.entityModel;
    this.action = data.action;
    this.before = data.before;
    this.after = data.after;
  }

  protected override async onChange(_event: EntityChangeEvent): Promise<void> {
    // Override method to prevent the changes tracking for future
  }

}


type Diff<T> = Partial<{
  [K in keyof T]: T[K] extends object ? Diff<T[K]> : { oldValue: T[K]; newValue: T[K] };
}>;

export class ObjectDiffer<T extends object> {
  getDifferences(obj1: T, obj2: T): Diff<T> {
    const differences = {} as Diff<T>;
    for (const key in obj1) {
      if (Object.prototype.hasOwnProperty.call(obj1, key)) {
        const value1 = obj1[key];
        const value2 = obj2[key];
        if (typeof value1 === 'object' && value1 !== null && typeof value2 === 'object' && value2 !== null) {
          const nestedDiff = this.getDifferences(value1 as any, value2 as any);
          if (Object.keys(nestedDiff).length > 0) {
            (differences as any)[key] = nestedDiff;
          }
        } else if (value1 !== value2) {
          (differences as any)[key] = { oldValue: value1, newValue: value2 };
        }
      }
    }
    return differences;
  }
}
