import { CONDITIONAL_RESOLVER_WILDCARD, ConditionalResolver } from '../../transactions/transaction';

// Get UI data mapped to specific transaction state & role for assignment process
export const getStateDataForAssignmentProcess = (txInfo, processInfo) => {
  const { transactionRole } = txInfo;
  const { processName, processState, states } = processInfo;
  const _ = CONDITIONAL_RESOLVER_WILDCARD;

  return new ConditionalResolver([processState, transactionRole])
    .cond([states.INQUIRY, _], () => {
      return { processName, processState, actionNeeded: true };
    })
    .cond([states.ACCEPTED, _], () => {
      return { processName, processState, actionNeeded: true };
    })
    .cond([states.COMPLETED, _], () => {
      return { processName, processState, isFinal: true };
    })
    .default(() => {
      // Default values for other states
      return { processName, processState };
    })
    .resolve();
};
