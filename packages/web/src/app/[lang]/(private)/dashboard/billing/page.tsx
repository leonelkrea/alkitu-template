'use client';

import { useTranslations } from '@/context/TranslationContext';
import { trpcReact } from '@/lib/trpc';

export default function BillingPage() {
  const t = useTranslations('userNav');

  const { data: billingRecords, isLoading } =
    trpcReact.billing.getBillingRecords.useQuery({
      userId: 'current', // Replace with actual user ID from session
    });

  if (isLoading) {
    return <div>{t('Common.general.loading')}</div>;
  }

  return (
    <div>
      <h1>{t('billing')}</h1>
      {billingRecords?.billingRecords.map((record: any) => (
        <div key={record.id}>
          <p>Plan: {record.plan}</p>
          <p>Status: {record.status}</p>
          <p>
            Amount: {record.amount} {record.currency}
          </p>
        </div>
      ))}
    </div>
  );
}
