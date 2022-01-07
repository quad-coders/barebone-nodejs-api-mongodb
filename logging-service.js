export class Logging {
  log(message, error = null) {
    // Generic console logging, in production should be replaced with logging framework
    console.log(message);
  }
}