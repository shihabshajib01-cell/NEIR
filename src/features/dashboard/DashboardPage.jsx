import React, { useState, useEffect } from 'react';
import {
  Download,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { MetricCard } from '../../components/data-display/MetricCard.jsx';
import { Card } from '../../components/data-display/Card.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { DateRangeFilter } from '../../components/forms/DateRangeFilter.jsx';
import { mockApi } from '../../services/mockApi.js';
import { LoadingState } from '../../components/feedback/FeedbackStates.jsx';
import { useToast } from '../../components/feedback/Toast.jsx';
import { DataTable } from '../../components/tables/DataTable.jsx';

const DUPLICATED_SUMMARY_KPIS = new Set([
  'white-list',
  'gray-list',
  'blocked',
  'auto-registered',
  'device-deregistered',
]);

export const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fromDate, setFromDate] = useState('2026-03-01');
  const [toDate, setToDate] = useState('2026-03-24');
  const { addToast } = useToast();

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await mockApi.getDashboardSummary();
      setData(res);
    } catch (err) {
      addToast('Failed to load dashboard metrics.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDownloadReport = () => {
    addToast('Generating BTRC National Equipment Identity Register Summary PDF report...', 'info');
  };

  if (isLoading || !data) {
    return <LoadingState message="Loading NEIR Executive Dashboard..." />;
  }

  const operationalKpis = data.kpis.filter((kpi) => !DUPLICATED_SUMMARY_KPIS.has(kpi.id));

  const trendColumns = [
    { key: 'month', title: 'Period' },
    {
      key: 'whiteList',
      title: 'White List',
      isMono: true,
      render: (value) => <p className="text-[#2E7D32]">{value.toLocaleString()}</p>,
    },
    {
      key: 'grayList',
      title: 'Gray List',
      isMono: true,
      render: (value) => <p className="text-[#B96B18]">{value.toLocaleString()}</p>,
    },
    {
      key: 'blackList',
      title: 'Blocked',
      isMono: true,
      render: (value) => <p className="text-[#C62828]">{value.toLocaleString()}</p>,
    },
  ];

  const operatorColumns = [
    { key: 'operator', title: 'Operator' },
    {
      key: 'autoCount',
      title: 'Auto Sync',
      isMono: true,
      render: (value) => <p className="text-[#028A97]">{value}</p>,
    },
    {
      key: 'deRegCount',
      title: 'De-Reg',
      isMono: true,
      render: (value) => <p className="text-[#01ADC1]">{value}</p>,
    },
    {
      key: 'share',
      title: 'Share',
      render: (value) => <p className="font-semibold">{value}</p>,
    },
  ];

  return (
    <div className="w-full space-y-5">
      <PageHeader
        title="Dashboard Summary"
        breadcrumbs={[{ label: 'Dashboard' }]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <DateRangeFilter
              startDate={fromDate}
              endDate={toDate}
              onStartDateChange={setFromDate}
              onEndDateChange={setToDate}
            />
            <Button
              variant="secondary"
              size="md"
              icon={RefreshCw}
              onClick={loadData}
              title="Refresh statistics"
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={Download}
              onClick={handleDownloadReport}
            >
              Download Report
            </Button>
          </div>
        }
      />

      <section aria-labelledby="operational-overview-title" className="space-y-3">
        <div>
          <h2 id="operational-overview-title" className="type-section-title text-[var(--color-text-primary)]">Operational Overview</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-3">
          {operationalKpis.map((kpi) => (
            <MetricCard
              key={kpi.id}
              title={kpi.label}
              value={kpi.value}
              change={kpi.change}
              category={kpi.category}
              tone={kpi.tone}
              compact
            />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <Card
            title="IMEI Summary"
            bodyClassName="p-4 sm:p-5"
            headerAction={
              <p className="type-meta font-mono text-[var(--color-text-secondary)] bg-[var(--color-background-subtle)] px-2.5 py-1 rounded-md border border-[var(--color-border)]">
                Total: 52,283,412
              </p>
            }
          >
            <div className="space-y-4">
              <div className="h-2.5 w-full rounded-full bg-[var(--color-background)] overflow-hidden flex">
                <div
                  style={{ width: `${data.imeiSummary.whiteList.percent}%` }}
                  className="bg-[#2E7D32] transition-all"
                  title={`White List: ${data.imeiSummary.whiteList.percent}%`}
                />
                <div
                  style={{ width: `${data.imeiSummary.grayList.percent}%` }}
                  className="bg-[#EF8F22] transition-all"
                  title={`Gray List: ${data.imeiSummary.grayList.percent}%`}
                />
                <div
                  style={{ width: `${data.imeiSummary.blackList.percent}%` }}
                  className="bg-[#C62828] transition-all"
                  title={`Black List: ${data.imeiSummary.blackList.percent}%`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-border-subtle)]">
                <div className="py-2 sm:py-0 sm:pr-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#2E7D32]" />
                    <p className="type-meta font-semibold text-[#2E7D32]">White List</p>
                  </div>
                  <p className="text-xl font-semibold text-[var(--color-text-primary)] font-mono tabular-nums mt-1.5">
                    {data.imeiSummary.whiteList.count.toLocaleString()}
                  </p>
                  <p className="type-meta text-[var(--color-text-muted)] mt-0.5">
                    {data.imeiSummary.whiteList.percent}% of active fleet
                  </p>
                </div>

                <div className="py-2 sm:py-0 sm:px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#EF8F22]" />
                    <p className="type-meta font-semibold text-[#B96B18]">Gray List</p>
                  </div>
                  <p className="text-xl font-semibold text-[var(--color-text-primary)] font-mono tabular-nums mt-1.5">
                    {data.imeiSummary.grayList.count.toLocaleString()}
                  </p>
                  <p className="type-meta text-[var(--color-text-muted)] mt-0.5">
                    {data.imeiSummary.grayList.percent}% under grace
                  </p>
                </div>

                <div className="py-2 sm:py-0 sm:pl-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#C62828]" />
                    <p className="type-meta font-semibold text-[#A91F22]">Blocked</p>
                  </div>
                  <p className="text-xl font-semibold text-[var(--color-text-primary)] font-mono tabular-nums mt-1.5">
                    {data.imeiSummary.blackList.count.toLocaleString()}
                  </p>
                  <p className="type-meta text-[var(--color-text-muted)] mt-0.5">
                    {data.imeiSummary.blackList.percent}% blocked
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--color-border-subtle)]">
                <h3 className="type-meta font-semibold text-[var(--color-text-secondary)] mb-2">
                  Recent 6-Month EIR Trajectory
                </h3>
                <div className="border border-[var(--color-border)] rounded-lg overflow-hidden">
                  <DataTable
                    embedded
                    stickyHeader={false}
                    keyField="month"
                    columns={trendColumns}
                    data={data.imeiSummary.recentMonthlyTrends}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-5">
          <Card
            title="Registration Summary"
            bodyClassName="p-4 sm:p-5"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 divide-x divide-[var(--color-border-subtle)] border-b border-[var(--color-border-subtle)] pb-4">
                <div className="pr-4">
                  <p className="type-meta text-[var(--color-text-secondary)]">Auto Registered</p>
                  <p className="text-xl font-semibold text-[#2E7D32] font-mono tabular-nums mt-1">
                    {data.registrationSummary.autoRegistration.count.toLocaleString()}
                  </p>
                  <p className="type-meta text-[#2E7D32] font-medium mt-0.5">
                    {data.registrationSummary.autoRegistration.change}
                  </p>
                </div>

                <div className="pl-4">
                  <p className="type-meta text-[var(--color-text-secondary)]">De-Registered</p>
                  <p className="text-xl font-semibold text-[var(--color-primary-dark)] font-mono tabular-nums mt-1">
                    {data.registrationSummary.deRegistration.count.toLocaleString()}
                  </p>
                  <p className="type-meta text-[var(--color-primary-dark)] font-medium mt-0.5">
                    {data.registrationSummary.deRegistration.change}
                  </p>
                </div>
              </div>

              <div className="border border-[var(--color-border)] rounded-lg overflow-hidden">
                <div className="px-3.5 py-2.5 bg-[var(--color-background-subtle)] border-b border-[var(--color-border)]">
                  <p className="type-meta font-semibold text-[var(--color-text-primary)]">Operator Sync Breakdown</p>
                </div>
                <DataTable
                  embedded
                  stickyHeader={false}
                  keyField="operator"
                  columns={operatorColumns}
                  data={data.registrationSummary.operatorBreakdown}
                />
              </div>

              <div className="flex items-start gap-2.5 type-meta text-[var(--color-success)]">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <p>All 4 MNO SS7/Diameter EIR interfaces operating within 12ms sync latency.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
