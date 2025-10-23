import mongoose, { Connection } from 'mongoose';
import IDatabase from 'src/domain/database/database.interface';
import MongoDBException from 'src/domain/exceptions/mongodb.exception';

export class MongoDatabase implements IDatabase {
  private session: mongoose.ClientSession | null = null;
  protected connection: Connection;
  private connectionURI: string;
  public schemaName: string;

  constructor(connectionURI: string, schemaName: string) {
    this.connectionURI = connectionURI;
    this.schemaName = schemaName;
  }

  async startConnection(): Promise<boolean> {
    if (!this.connectionURI)
      throw new MongoDBException(
        'MongoDB connection failed, check the environment variables',
      );

    this.connection = mongoose.createConnection(this.connectionURI, {
      dbName: this.schemaName,
    });

    return true;
  }

  public getConnection() {
    return this.connection;
  }

  isTransactionActive(): boolean {
    return this.session !== null;
  }

  async startTransaction(): Promise<void> {
    if (!this.session) {
      this.session = await mongoose.startSession();
      this.session.startTransaction();
    }
  }

  async commit(): Promise<boolean> {
    if (this.session) {
      await this.session.commitTransaction();
      this.session.endSession();
      this.session = null;
      return true;
    }
    return false;
  }

  async rollback(): Promise<void> {
    if (this.session) {
      await this.session.abortTransaction();
      await this.session.endSession();
      this.session = null;
    }
  }

  async release(): Promise<void> {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}
