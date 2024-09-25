/* eslint no-use-before-define: 0 */
/* eslint-disable no-console */

export const logStyles = {
  log: "color: #3498db; font-weight: bold;", // Blue
  info: "color: #2ecc71; font-weight: bold;", // Green
  warn: "color: #f39c12; font-weight: bold;", // Orange
  error: "color: #e74c3c; font-weight: bold;", // Red
  title: "color: #9b59b6; font-weight: bold;", // Purple
};

export type LogData = Record<string, any> | null;

export const log = (message: string, data: LogData = null): void => {
  console.log(`%c🔵 ${message}`, logStyles.log, data);
};

export const info = (message: string, data: LogData = null): void => {
  console.info(`%c🟢 ${message}`, logStyles.info, data);
};

export const warn = (message: string, data: LogData = null): void => {
  console.warn(`%c🟠 ${message}`, logStyles.warn, data);
};

export const error = (message: string, data: LogData = null): void => {
  console.error(`%c🔴 ${message}`, logStyles.error, data);
};

export const title = (message: string): void => {
  console.log(`%c📢 ${message}`, logStyles.title);
};
