import { useEffect } from 'react';

interface PayPalButtonProps {
  productName: string;
  amount: string;
  itemNumber: string;
  description?: string;
}

const PayPalCheckout: React.FC<PayPalButtonProps> = ({
  productName,
  amount,
  itemNumber,
  description = ''
}) => {
  // PayPal Business Email (associated with admin@goolle.shop)
  const PAYPAL_EMAIL = 'ciwaankamustafa@gmail.com';
  const BUSINESS_EMAIL = 'admin@goolle.shop';
  
  // Create PayPal form and submit
  const handlePayPalCheckout = () => {
    const form = document.createElement('form');
    form.setAttribute('action', 'https://www.paypal.com/cgi-bin/webscr');
    form.setAttribute('method', 'post');
    form.setAttribute('target', '_top');

    const fields = {
      cmd: '_xclick',
      business: PAYPAL_EMAIL,
      item_name: productName,
      item_number: itemNumber,
      amount: amount,
      currency_code: 'USD',
      return: `${window.location.origin}/thank-you?product=${itemNumber}`,
      cancel_return: window.location.href,
      notify_url: `${window.location.origin}/api/ipn`,
      invoice: `${itemNumber}-${Date.now()}`,
      custom: BUSINESS_EMAIL,
      no_shipping: '1',
      rm: '2',
    };

    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', key);
      input.setAttribute('value', value as string);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  return (
    <button 
      onClick={handlePayPalCheckout}
      className="paypal-button"
      style={{
        backgroundColor: '#0070ba',
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        display: 'inline-block',
        margin: '10px 0'
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#005ea6')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0070ba')}
    >
      PayPal Checkout → ${amount}
    </button>
  );
};

export default PayPalCheckout;
