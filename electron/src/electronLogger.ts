import log from 'electron-log/main';

/**
 * Retorna uma  função para criar um logger.
 * @param logId - Identificador do logger (também é o nome do arquivo).
 */
export function createElectronLogger(logId: string) {
  const logger = log.create({ logId });

  logger.transports.file.format =
    '📢 [{d}/{m}/{y}, {h}:{i}:{s}] [{level}]{text}';

  logger.transports.file.fileName = `${logId}.log`;

  return logger;
}
