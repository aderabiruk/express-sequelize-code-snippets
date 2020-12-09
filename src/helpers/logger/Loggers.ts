import logger from './Winston';

/**
 * Log Event Emission
 * 
 * @param event 
 * @param body 
 */
export const logEventEmissions = (event: string, body: any) => {
    logger.info(`Event Emitted\n\tEvent: ${event}\n\tPayload: ${body}`);
};

/**
 * Log Event Capture
 * 
 * @param event 
 * @param body 
 */
export const logEventCaptures = (event: string, body: any) => {
    logger.info(`Event Captured\n\tEvent: ${event}\n\tPayload: ${body}`);
};

/**
 * Log Event Error
 * 
 * @param event 
 * @param body 
 */
export const logEventErrors = (event: string, body: any) => {
    logger.info(`Event Error\n\tEvent: ${event}\n\tError: ${body}`);
};

/**
 * Log Event Completion
 * 
 * @param event 
 * @param body 
 */
export const logEventCompletion = (event: string, body: any) => {
    logger.info(`Event Processing Completed\n\tEvent: ${event}\n\tPayload: ${body}`);
};
