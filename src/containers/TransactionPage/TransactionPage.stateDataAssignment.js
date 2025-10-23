import { CONDITIONAL_RESOLVER_WILDCARD, ConditionalResolver } from '../../transactions/transaction';

// Get UI data mapped to specific transaction state & role for assignment process
export const getStateDataForAssignmentProcess = (txInfo, processInfo) => {
  const { 
    transactionRole
  } = txInfo;
  const { processName, processState, states, transitions, leaveReviewProps: getLeaveReviewProps } = processInfo;
  const _ = CONDITIONAL_RESOLVER_WILDCARD;

  // eslint-disable-next-line no-console
  console.log('🔍 getStateDataForAssignmentProcess:', {
    processState,
    transactionRole,
    states,
    hasLeaveReviewProps: !!getLeaveReviewProps,
    statesCompleted: states.COMPLETED,
  });

  return new ConditionalResolver([processState, transactionRole])
    .cond([states.INQUIRY, _], () => {
      return { processName, processState, actionNeeded: true };
    })
    .cond([states.ACCEPTED, _], () => {
      return { processName, processState, actionNeeded: true };
    })
    .cond([states.COMPLETED, 'customer'], () => {
      // Customer can leave review after work is completed
      // eslint-disable-next-line no-console
      console.log('✅ COMPLETED state for CUSTOMER - showing review button');
      const leaveReview = getLeaveReviewProps
        ? getLeaveReviewProps(transitions.REVIEW_1_BY_CUSTOMER, 'customer')
        : null;
      
      // eslint-disable-next-line no-console
      console.log('  leaveReview button:', leaveReview);
      
      return { 
        processName, 
        processState, 
        isFinal: false,
        actionNeeded: true,
        showActionButtons: true,
        primaryButtonProps: leaveReview,
      };
    })
    .cond([states.COMPLETED, 'provider'], () => {
      // Provider can leave review after work is completed
      // eslint-disable-next-line no-console
      console.log('✅ COMPLETED state for PROVIDER - showing review button');
      const leaveReview = getLeaveReviewProps
        ? getLeaveReviewProps(transitions.REVIEW_1_BY_PROVIDER, 'provider')
        : null;
      
      const result = { 
        processName, 
        processState, 
        isFinal: false,
        actionNeeded: true,
        showActionButtons: true,
        primaryButtonProps: leaveReview,
      };
      
      // eslint-disable-next-line no-console
      console.log('  Полный stateData для PROVIDER:', result);
      
      return result;
    })
    .cond([states.REVIEWED_BY_CUSTOMER, 'provider'], () => {
      // Provider can leave second review
      const leaveReview = getLeaveReviewProps
        ? getLeaveReviewProps(transitions.REVIEW_2_BY_PROVIDER, 'provider')
        : null;
      
      return { 
        processName, 
        processState, 
        isFinal: false,
        actionNeeded: true,
        showActionButtons: true,
        primaryButtonProps: leaveReview,
      };
    })
    .cond([states.REVIEWED_BY_CUSTOMER, 'customer'], () => {
      // Customer has already reviewed, waiting for provider
      return { 
        processName, 
        processState, 
        isFinal: false,
        actionNeeded: false,
      };
    })
    .cond([states.REVIEWED_BY_PROVIDER, 'customer'], () => {
      // Customer can leave second review
      const leaveReview = getLeaveReviewProps
        ? getLeaveReviewProps(transitions.REVIEW_2_BY_CUSTOMER, 'customer')
        : null;
      
      return { 
        processName, 
        processState, 
        isFinal: false,
        actionNeeded: true,
        showActionButtons: true,
        primaryButtonProps: leaveReview,
      };
    })
    .cond([states.REVIEWED_BY_PROVIDER, 'provider'], () => {
      // Provider has already reviewed, waiting for customer
      return { 
        processName, 
        processState, 
        isFinal: false,
        actionNeeded: false,
      };
    })
    .cond([states.REVIEWED, _], () => {
      // Both parties have reviewed, transaction is final
      return { 
        processName, 
        processState, 
        isFinal: true,
      };
    })
    .default(() => {
      // Default values for other states
      return { processName, processState };
    })
    .resolve();
};
