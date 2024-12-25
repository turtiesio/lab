# Logging

1. JSON Structured logging
2. Centralized logging
3. Log retention, rotation
4. Context
   1. Request ID
   2. User ID
   3. Timestamp
   4. Error stack
   5. File/Module name
   6. Class name
   7. Releveant data
      1. HTTP Request/Response
      2. HTTP Method
      3. IP
      4. ...
5. Redaction/Masking
   1. Remove sensitive data(e.g., passwords)
6. Performance
   1. Async logging
   2. Formatting(use pino?)
   3. Batching
   4. Sampling
   5. Production log level: info
7. Error monitoring
   1. Error Trackers
   2. Alert: high error rate or specific error.
8. Correlation IDs
   1. Trace ID(Middleware)

## Logging context

## Windston vs Pino

| Feature              | Pino                                              | Winston                                             |
| -------------------- | ------------------------------------------------- | --------------------------------------------------- |
| Performance          | Significantly Faster                              | Slower                                              |
| Log Format           | Primarily JSON (structured)                       | Customizable (JSON, text, custom)                   |
| Transports           | Growing selection                                 | Extensive selection                                 |
| Maturity             | Mature, but younger than Winston                  | Very mature, widely adopted                         |
| Complexity           | Generally simpler                                 | Can be complex due to extensive features            |
| Ideal Use Cases      | Performance-critical, cloud-native, microservices | General-purpose, legacy applications, diverse needs |
| Asynchronous Logging | Built-in Asynchronous Mode                        | Possible via Transports                             |
