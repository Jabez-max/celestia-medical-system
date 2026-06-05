'use client';

import { useState } from 'react';

export default function TestEmailPage() {
  const [loading, setLoading] = useState(false);

  const handleSendEmail = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'palitan_ng_email_mo@gmail.com', // <-- ILAGAY DITO ANG TOTOONG EMAIL MO BAGO I-TEST
          subject: 'Celestia Medical - System Test',
          message: 'Hello! Ito ay isang test email mula sa Celestia Medical Next.js system mo. Gumagana ang API!',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Success! Check mo na yung email mo.');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('May nangyaring mali sa pag-send ng email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-sans p-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-blue-900">Celestia Medical Email Test</h1>
        <p className="mb-6 text-gray-600">
          I-click ang button sa ibaba para i-trigger ang API at mag-send ng test email.
        </p>
        
        <button 
          onClick={handleSendEmail} 
          disabled={loading}
          className={`w-full text-white px-4 py-3 rounded-md font-semibold transition-colors ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Sending Email...' : 'Send Test Email'}
        </button>
      </div>
    </div>
  );
}