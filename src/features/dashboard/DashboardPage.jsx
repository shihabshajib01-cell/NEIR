import React, { useState, useEffect } from 'react';
import {
  Download,
  Calendar,
  RefreshCw,
  TrendingUp,
  Shield,
  Smartphone,
  Radio,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  PieChart,
  BarChart3
} from 'lucide-react';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { MetricCard } from '../../components/data-display/MetricCard.jsx';
import { Card } from '../../components/data-display/Card.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { DateInput } from '../../components/forms/TextInput.jsx';
import { mockApi } from '../../services/mockApi.js';
import { LoadingState } from '../../components/feedback/FeedbackStates.jsx';
import { useToast } from '../../components/feedback/Toast.jsx';

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

  return (
    <div className="space-y-6">
      {/* Page Header with Date Filter and Download Action */}
      <PageHeader
        title="Dashboard Summary"
        description="National Equipment Identity Register real-time operational status, EIR device classification, and operator synchronization."
        breadcrumbs={[{ label: 'Dashboard' }]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white border border-[#E2E5F0] rounded-md px-2.5 py-1 text-xs text-[#626981]">
              <Calendar className="w-3.5 h-3.5 text-[#7A8197]" />
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="text-xs bg-transparent text-[#202338] outline-hidden cursor-pointer"
              />
              <span className="text-[#A0A6B8]">to</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="text-xs bg-transparent text-[#202338] outline-hidden cursor-pointer"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={loadData}
              title="Refresh statistics"
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Download}
              onClick={handleDownloadReport}
            >
              Download Report
            </Button>
          </div>
        }
      />

      {/* 10 Compact KPI Cards Grid (4 to 5 per row desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {data.kpis.map((kpi) => (
          <MetricCard
            key={kpi.id}
            title={kpi.label}
            value={kpi.value}
            change={kpi.change}
            category={kpi.category}
            tone={kpi.tone}
          />
        ))}
      </div>

      {/* Main Charts Row: IMEI Summary + Registration Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* IMEI Summary Chart Card (7 cols) */}
        <div className="lg:col-span-7">
          <Card
            title="IMEI Summary"
            subtitle="Distribution of 52.28 Million registered handsets across EIR compliance tiers"
            headerAction={
              <span className="text-xs font-mono text-[#626981] bg-[#F7F8FC] px-2 py-1 rounded border border-[#E2E5F0]">
                Total: 52,283,412
              </span>
            }
          >
            {/* Visual Distribution Progress Bar */}
            <div className="space-y-3">
              <div className="h-4 w-full rounded-full bg-slate-100 overflow-hidden flex border border-[#E2E5F0]">
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

              {/* Legend & Breakdown */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-lg border border-[#2E7D32]/20 bg-[#2E7D32]/5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" />
                    <span className="text-xs font-semibold text-[#2E7D32]">White List</span>
                  </div>
                  <div className="text-lg font-bold text-[#202338] font-mono tabular-nums mt-1">
                    {data.imeiSummary.whiteList.count.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-[#626981]">{data.imeiSummary.whiteList.percent}% of active fleet</span>
                </div>

                <div className="p-3 rounded-lg border border-[#EF8F22]/20 bg-[#EF8F22]/5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#EF8F22]" />
                    <span className="text-xs font-semibold text-[#B96B18]">Gray List</span>
                  </div>
                  <div className="text-lg font-bold text-[#202338] font-mono tabular-nums mt-1">
                    {data.imeiSummary.grayList.count.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-[#626981]">{data.imeiSummary.grayList.percent}% under grace</span>
                </div>

                <div className="p-3 rounded-lg border border-[#C62828]/20 bg-[#C62828]/5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#C62828]" />
                    <span className="text-xs font-semibold text-[#A91F22]">Black List / Block</span>
                  </div>
                  <div className="text-lg font-bold text-[#202338] font-mono tabular-nums mt-1">
                    {data.imeiSummary.blackList.count.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-[#626981]">{data.imeiSummary.blackList.percent}% blocked</span>
                </div>
              </div>

              {/* Monthly Trend Mini Table */}
              <div className="mt-4 pt-3 border-t border-[#E2E5F0]">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#626981] mb-2">
                  Recent 6-Month EIR Trajectory
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[#7A8197] border-b border-[#E2E5F0] font-medium">
                      <tr>
                        <th className="py-1.5">Period</th>
                        <th className="py-1.5">White List</th>
                        <th className="py-1.5">Gray List</th>
                        <th className="py-1.5">Blocked</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F7F8FC] font-mono">
                      {data.imeiSummary.recentMonthlyTrends.map((trend) => (
                        <tr key={trend.month} className="hover:bg-[#F7F8FC]">
                          <td className="py-1.5 font-sans font-medium text-[#202338]">{trend.month}</td>
                          <td className="py-1.5 text-[#2E7D32]">{trend.whiteList.toLocaleString()}</td>
                          <td className="py-1.5 text-[#EF8F22]">{trend.grayList.toLocaleString()}</td>
                          <td className="py-1.5 text-[#C62828]">{trend.blackList.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Registration Summary Card (5 cols) */}
        <div className="lg:col-span-5">
          <Card
            title="Registration Summary"
            subtitle="Monthly automated MNO pairing vs citizen de-registration volume"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-[#F7F8FC] border border-[#E2E5F0]">
                  <span className="text-xs text-[#626981] font-medium">Auto Registered</span>
                  <div className="text-xl font-bold text-[#2E7D32] font-mono tabular-nums mt-1">
                    {data.registrationSummary.autoRegistration.count.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-[#2E7D32] font-medium">
                    {data.registrationSummary.autoRegistration.change}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-[#F7F8FC] border border-[#E2E5F0]">
                  <span className="text-xs text-[#626981] font-medium">De-Registered</span>
                  <div className="text-xl font-bold text-[#4B5694] font-mono tabular-nums mt-1">
                    {data.registrationSummary.deRegistration.count.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-[#4B5694] font-medium">
                    {data.registrationSummary.deRegistration.change}
                  </span>
                </div>
              </div>

              {/* Operator breakdown table */}
              <div className="border border-[#E2E5F0] rounded-lg overflow-hidden">
                <div className="px-3.5 py-2 bg-[#F7F8FC] border-b border-[#E2E5F0] text-xs font-semibold text-[#202338]">
                  Operator Sync Breakdown
                </div>
                <table className="w-full text-xs text-left">
                  <thead className="bg-white border-b border-[#E2E5F0] text-[#7A8197]">
                    <tr>
                      <th className="px-3 py-2 font-medium">Operator</th>
                      <th className="px-3 py-2 font-medium">Auto Sync</th>
                      <th className="px-3 py-2 font-medium">De-Reg</th>
                      <th className="px-3 py-2 font-medium">Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F7F8FC] font-mono">
                    {data.registrationSummary.operatorBreakdown.map((row) => (
                      <tr key={row.operator} className="hover:bg-[#F7F8FC]">
                        <td className="px-3 py-2 font-sans font-medium text-[#202338]">{row.operator}</td>
                        <td className="px-3 py-2 text-[#343D73]">{row.autoCount}</td>
                        <td className="px-3 py-2 text-[#4B5694]">{row.deRegCount}</td>
                        <td className="px-3 py-2 font-sans font-semibold text-[#202338]">{row.share}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All 4 MNO SS7/Diameter EIR interfaces operating within 12ms sync latency.</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
