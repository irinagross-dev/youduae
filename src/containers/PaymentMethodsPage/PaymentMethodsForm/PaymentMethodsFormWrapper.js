import React from 'react';
import { useStripe } from '../../../hooks/useStripe';
import { IconSpinner } from '../../../components';
import PaymentMethodsForm from './PaymentMethodsForm';

/**
 * Wrapper for PaymentMethodsForm that handles lazy loading of Stripe.js
 * Only loads Stripe when this component is rendered
 */
const PaymentMethodsFormWrapper = (props) => {
  const { stripe, loading, error } = useStripe();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '40px',
        minHeight: '200px'
      }}>
        <IconSpinner />
        <span style={{ marginLeft: '12px' }}>Loading payment form...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f9e6e6', 
        border: '1px solid #e74c3c',
        borderRadius: '4px',
        color: '#c0392b'
      }}>
        <strong>Error loading payment system:</strong> {error.message}
      </div>
    );
  }

  if (!stripe) {
    return (
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffc107',
        borderRadius: '4px'
      }}>
        Payment system is not available. Please refresh the page.
      </div>
    );
  }

  // Stripe is loaded, render the actual form
  return <PaymentMethodsForm {...props} />;
};

export default PaymentMethodsFormWrapper;

