class Exception extends Error {
  constructor(public message: string) {
    super(message);
    this.name = this.constructor.toString().match(/\w+/g)?.[1] ?? '';
  }
}

export default Exception;
