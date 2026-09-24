import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../../components/forms/Button.jsx';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mb-4">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <span className="text-xs font-mono font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2.5 py-1 rounded">
        404 — Endpoint Not Found
      </span>
      <h1 className="text-2xl font-bold text-[#102A43] tracking-tight mt-3">
        Regulatory Route Unavailable
      </h1>
      <p className="text-xs text-[#52677A] max-w-md mt-1 leading-relaxed">
        The requested administrative route or registry resource could not be located on the BTRC NEIR portal.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Link to="/dashboard">
          <Button variant="primary" size="md" icon={Home}>
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
