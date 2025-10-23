interface IDatabase {
  startConnection(): Promise<boolean>;
  isTransactionActive(): boolean;
  startTransaction(): Promise<void>;
  commit(): Promise<boolean>;
  rollback(): Promise<void>;
  release(): Promise<void>;
}

export default IDatabase;
