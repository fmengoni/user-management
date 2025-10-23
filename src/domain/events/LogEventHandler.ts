import { LogEntity, ObjectDiffer } from 'src/logger/model/LogEntity';
import { EventHandler } from './EventHandler';
import { LogAction } from './EventType';
import { IEvent } from './IEvent';
import { IEventBus } from './IEventBus';
import { MongoLogRepository } from 'src/logger/repository/log.repository';

class LogEventHandler extends EventHandler {
  constructor(protected eventBus: IEventBus) {
    super(eventBus);
  }

  protected subscribe(eventBus: IEventBus): void {
    console.log('LogEventHandler created');
    eventBus.subscribe(LogAction.CREATED, async (event: IEvent) => {
      console.log(`[LogEventHandler.${LogAction.CREATED}:`, event);

      const { action, entityData, data, userId, userData } = event.payload;

      let changesData = {
        before: data.before ?? {},
        after: data.after ?? {},
      };
      try {
        if (action === LogAction.UPDATED) {
          const analyzer = new ObjectDiffer();
          const changes: Record<string, any> = analyzer.getDifferences(
            data.before,
            data.after,
          );
          changesData = Object.keys(changes).reduce((data, key) => {
              const values: { oldValue: string; newValue: string } =
                changes[key];
              return {
                before: { ...data.before, [key]: values.oldValue },
                after: { ...data.after, [key]: values.newValue },
              };
            },
            { before: {}, after: {} },
          );
        }

        const log = LogEntity.build({
          userId,
          userData,
          action,
          entityId: entityData.key,
          entityModel: entityData.name,
          before: changesData.before,
          after: changesData.after,
        });

        const appContext = await getApplicationContext();
        const logRepository: MongoLogRepository = appContext.get(ServiceProviderIds.LOG_REPOSITORY);

        await logRepository.create(log)
        console.info('Log Transaction Created:', log)
      } catch (err) {
        console.log(`[LogEventHandler.${EventType.LogAction.CREATED}]: Error`, err)
      }
    })
  }
}

export default LogEventHandler
