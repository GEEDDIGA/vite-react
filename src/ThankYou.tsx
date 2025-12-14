import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const ThankYou: React.FC = () => {
  const [searchParams] = useSearchParams();
  const product = searchParams.get('product');
  const [downloadReady, setDownloadReady] = useState(false);

  useEffect(() => {
    // Simulate download preparation
    const timer = setTimeout(() => setDownloadReady(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const productInfo: Record<string, any> = {
    'ai-prompts-50': {
      name: 'AI Prompt Pack for Business Owners',
      description: '50 ChatGPT prompts to boost your productivity',
      downloadLink: 'https://gumroad.com/l/ctezr',
      price: '$19.99'
    },
    'hospital-manager': {
      name: 'Hospital Manager App',
      description: 'Comprehensive hospital management system',
      downloadLink: 'https://hospitalmanager.pythonanywhere.com',
      price: '$299.00'
    }
  };

  const currentProduct = product ? productInfo[product] : null;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '40px',
        textAlign: 'center',
        maxWidth: '500px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#667eea', marginTop: 0 }}>✨ Thank You!</h1>
        <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
          Your payment was successful!
        </p>
        
        {currentProduct && (
          <div style={{
            backgroundColor: '#f5f5f5',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '30px',
            textAlign: 'left'
          }}>
            <h3 style={{ marginTop: 0, color: '#333' }}>Order Confirmation</h3>
            <p><strong>Product:</strong> {currentProduct.name}</p>
            <p><strong>Price:</strong> {currentProduct.price}</p>
            <p><strong>Status:</strong> <span style={{ color: 'green' }}>✓ Payment Received</span></p>
          </div>
        )}

        <div style={{ marginBottom: '30px' }}>
          {downloadReady ? (
            <>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                🎉 Your download is ready! Check your email for details.
              </p>
              <a
                href={currentProduct?.downloadLink || 'https://goolle.shop'}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#667eea',
                  color: 'white',
                  padding: '12px 30px',
                  borderRadius: '5px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  marginRight: '10px',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#764ba2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#667eea')}
              >
                Download Now →
              </a>
              <a
                href="https://goolle.shop"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#f0f0f0',
                  color: '#333',
                  padding: '12px 30px',
                  borderRadius: '5px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e0e0e0')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
              >
                Return Home
              </a>
            </>
          ) : (
            <p style={{ color: '#999' }}>⏳ Preparing your download...</p>
          )}
        </div>

        <div style={{
          borderTop: '1px solid #eee',
          paddingTop: '20px',
          marginTop: '20px',
          fontSize: '14px',
          color: '#999'
        }}>
          <p>Questions? Contact us at <a href="mailto:admin@goolle.shop" style={{ color: '#667eea' }}>admin@goolle.shop</a></p>
          <p>Invoice details have been sent to your email address.</p>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
