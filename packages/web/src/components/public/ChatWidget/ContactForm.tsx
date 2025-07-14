'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ContactFormProps {
  onSubmit: (contactData: {
    name: string;
    email: string;
    phone?: string;
    message?: string;
  }) => void;
  isLoading: boolean;
  config: any;
}

export function ContactForm({ onSubmit, isLoading, config }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="p-4 space-y-4">
      <div className="text-center">
        <h3 className="font-semibold text-lg">
          {config?.welcomeMessage || 'Start a conversation'}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {config?.contactFormMessage ||
            'Please provide your contact information to start chatting with us.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Your name"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="your@email.com"
            required
            disabled={isLoading}
          />
        </div>

        {config?.showPhoneField && (
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Your phone number"
              disabled={isLoading}
            />
          </div>
        )}

        {config?.showMessageField && (
          <div>
            <Label htmlFor="message">Initial Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder="How can we help you?"
              rows={3}
              disabled={isLoading}
            />
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !formData.name || !formData.email}
          style={{
            backgroundColor: config?.primaryColor || '#007ee6',
            color: config?.textColor || '#FFFFFF',
          }}
        >
          {isLoading ? 'Starting chat...' : 'Start Chat'}
        </Button>
      </form>

      <p className="text-xs text-gray-500 text-center">
        {config?.privacyMessage ||
          'Your information is secure and will not be shared.'}
      </p>
    </div>
  );
}
