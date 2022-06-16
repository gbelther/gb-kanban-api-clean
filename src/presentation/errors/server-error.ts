export class ServerError extends Error {
  constructor(stack: string) {
    super('Server error');
    this.name = 'ServerError';
    this.stack = stack;
  }
}
