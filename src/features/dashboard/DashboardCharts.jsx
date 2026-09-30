import React, { useMemo } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { Card } from '../../components/data-display/Card.jsx';
import { usePreferences } from '../../system/PreferencesContext.jsx';

const chartSx = {
  '& .MuiChartsAxis-tickLabel': {
    fill: 'var(--color-text-secondary)',
    fontFamily: 'inherit',
    fontSize: 'var(--type-meta-size)',
  },
  '& .MuiChartsAxis-line, & .MuiChartsAxis-tick': {
    stroke: 'var(--color-border-strong)',
  },
  '& .MuiChartsGrid-line': {
    stroke: 'var(--color-border-subtle)',
  },
  '& .MuiChartsLegend-label': {
    fill: 'var(--color-text-secondary)',
    fontFamily: 'inherit',
    fontSize: 'var(--type-meta-size)',
  },
};

const parseCount = (value) => {
  if (typeof value === 'number') return value;
  const parsed = Number(String(value ?? '').replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
};

const toIndex = (value, baseline) => {
  if (!baseline) return 0;
  return Number(((value / baseline) * 100).toFixed(2));
};

const DashboardCharts = ({
  kpis = [],
  imeiSummary,
  registrationSummary,
}) => {
  const { t, locale } = usePreferences();

  const compactFormatter = useMemo(
    () => new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }),
    [locale]
  );

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }),
    [locale]
  );

  const getKpiValue = (id) =>
    parseCount(kpis.find((item) => item.id === id)?.value);

  const trendData = imeiSummary?.recentMonthlyTrends ?? [];
  const operatorData = registrationSummary?.operatorBreakdown ?? [];

  const indexedTrendData = useMemo(() => {
    const baseline = trendData[0];
    if (!baseline) return [];

    return trendData.map((item) => ({
      month: item.month,
      whiteList: toIndex(item.whiteList, baseline.whiteList),
      grayList: toIndex(item.grayList, baseline.grayList),
      blackList: toIndex(item.blackList, baseline.blackList),
    }));
  }, [trendData]);

  const operatorChartData = useMemo(
    () =>
      operatorData.map((item) => ({
        operator: item.operator,
        autoCount: parseCount(item.autoCount),
        deRegCount: parseCount(item.deRegCount),
      })),
    [operatorData]
  );

  const specialRequestTotal = getKpiValue('special-req');
  const specialRequestAccepted = getKpiValue('special-req-accepted');
  const specialRequestPending = Math.max(0, specialRequestTotal - specialRequestAccepted);

  const lostDevices = getKpiValue('lost-devices');
  const recoveredDevices = getKpiValue('found-devices');
  const unrecoveredDevices = Math.max(0, lostDevices - recoveredDevices);

  const enforcementData = [
    { category: t('Blocked Devices'), value: getKpiValue('blocked') },
    { category: t('Access Denied'), value: getKpiValue('access-denied') },
  ];

  const registrationActivityData = [
    {
      category: t('Auto Registered'),
      value: registrationSummary?.autoRegistration?.count ?? 0,
    },
    {
      category: t('De-Registered'),
      value: registrationSummary?.deRegistration?.count ?? 0,
    },
  ];

  const indexFormatter = (value) =>
    value == null ? '' : Number(value).toFixed(1);

  const countFormatter = (value) =>
    value == null ? '' : numberFormatter.format(Number(value));

  const compactCountFormatter = (value) =>
    value == null ? '' : compactFormatter.format(Number(value));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        <Card
          title="IMEI Registry Composition"
          subtitle="Current active EIR classification"
          bodyClassName="p-3 sm:p-4"
          className="min-w-0"
        >
          <PieChart
            series={[
              {
                innerRadius: 58,
                outerRadius: 92,
                paddingAngle: 1,
                cornerRadius: 3,
                data: [
                  {
                    id: 'white-list',
                    value: imeiSummary?.whiteList?.count ?? 0,
                    label: t('White List'),
                    color: '#2E7D32',
                  },
                  {
                    id: 'gray-list',
                    value: imeiSummary?.grayList?.count ?? 0,
                    label: t('Gray List'),
                    color: '#EF8F22',
                  },
                  {
                    id: 'blocked',
                    value: imeiSummary?.blackList?.count ?? 0,
                    label: t('Blocked'),
                    color: '#C62828',
                  },
                ],
                valueFormatter: (item) => countFormatter(item.value),
              },
            ]}
            height={260}
            margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
            sx={chartSx}
          />
        </Card>

        <Card
          title="Special Request Outcome"
          subtitle="Accepted vs pending requests"
          bodyClassName="p-3 sm:p-4"
          className="min-w-0"
        >
          <PieChart
            series={[
              {
                innerRadius: 58,
                outerRadius: 92,
                paddingAngle: 2,
                cornerRadius: 3,
                data: [
                  {
                    id: 'accepted',
                    value: specialRequestAccepted,
                    label: t('Accepted'),
                    color: '#2E7D32',
                  },
                  {
                    id: 'pending',
                    value: specialRequestPending,
                    label: t('Pending'),
                    color: '#EF8F22',
                  },
                ],
                valueFormatter: (item) => countFormatter(item.value),
              },
            ]}
            height={260}
            margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
            sx={chartSx}
          />
        </Card>

        <Card
          title="Lost Device Recovery"
          subtitle="Recovered vs still unresolved"
          bodyClassName="p-3 sm:p-4"
          className="min-w-0"
        >
          <PieChart
            series={[
              {
                innerRadius: 58,
                outerRadius: 92,
                paddingAngle: 2,
                cornerRadius: 3,
                data: [
                  {
                    id: 'recovered',
                    value: recoveredDevices,
                    label: t('Recovered'),
                    color: '#2E7D32',
                  },
                  {
                    id: 'unresolved',
                    value: unrecoveredDevices,
                    label: t('Unresolved'),
                    color: '#EF8F22',
                  },
                ],
                valueFormatter: (item) => countFormatter(item.value),
              },
            ]}
            height={260}
            margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
            sx={chartSx}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
        <Card
          title="Enforcement Activity"
          subtitle="Blocked devices and denied registration attempts"
          bodyClassName="p-3 sm:p-4"
          className="min-w-0"
        >
          <BarChart
            dataset={enforcementData}
            xAxis={[
              {
                scaleType: 'band',
                dataKey: 'category',
                height: 42,
              },
            ]}
            yAxis={[
              {
                width: 54,
                valueFormatter: compactCountFormatter,
              },
            ]}
            series={[
              {
                dataKey: 'value',
                label: t('Count'),
                color: '#C62828',
                valueFormatter: countFormatter,
              },
            ]}
            height={280}
            grid={{ horizontal: true }}
            borderRadius={4}
            margin={{ top: 16, right: 16, bottom: 8, left: 8 }}
            sx={chartSx}
          />
        </Card>

        <Card
          title="Registration Activity"
          subtitle="Current automated registration flow"
          bodyClassName="p-3 sm:p-4"
          className="min-w-0"
        >
          <BarChart
            dataset={registrationActivityData}
            xAxis={[
              {
                scaleType: 'band',
                dataKey: 'category',
                height: 42,
              },
            ]}
            yAxis={[
              {
                width: 54,
                valueFormatter: compactCountFormatter,
              },
            ]}
            series={[
              {
                dataKey: 'value',
                label: t('Count'),
                color: 'var(--color-primary)',
                valueFormatter: countFormatter,
              },
            ]}
            height={280}
            grid={{ horizontal: true }}
            borderRadius={4}
            margin={{ top: 16, right: 16, bottom: 8, left: 8 }}
            sx={chartSx}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
        <Card
          title="Recent 6-Month EIR Trajectory"
          subtitle="Relative movement · Oct 2025 = 100"
          bodyClassName="p-3 sm:p-4"
          className="min-w-0"
        >
          <LineChart
            dataset={indexedTrendData}
            xAxis={[
              {
                scaleType: 'point',
                dataKey: 'month',
                height: 32,
              },
            ]}
            yAxis={[
              {
                width: 46,
                valueFormatter: indexFormatter,
              },
            ]}
            series={[
              {
                id: 'white-list-trend',
                dataKey: 'whiteList',
                label: t('White List'),
                color: '#2E7D32',
                showMark: true,
                valueFormatter: indexFormatter,
              },
              {
                id: 'gray-list-trend',
                dataKey: 'grayList',
                label: t('Gray List'),
                color: '#EF8F22',
                showMark: true,
                valueFormatter: indexFormatter,
              },
              {
                id: 'blocked-trend',
                dataKey: 'blackList',
                label: t('Blocked'),
                color: '#C62828',
                showMark: true,
                valueFormatter: indexFormatter,
              },
            ]}
            height={320}
            grid={{ horizontal: true }}
            margin={{ top: 16, right: 16, bottom: 8, left: 8 }}
            sx={chartSx}
          />
        </Card>

        <Card
          title="Operator Sync Breakdown"
          subtitle="Auto Sync vs De-Registration by operator"
          bodyClassName="p-3 sm:p-4"
          className="min-w-0"
        >
          <BarChart
            dataset={operatorChartData}
            yAxis={[
              {
                scaleType: 'band',
                dataKey: 'operator',
                width: 118,
              },
            ]}
            xAxis={[
              {
                height: 28,
                valueFormatter: compactCountFormatter,
              },
            ]}
            series={[
              {
                id: 'auto-sync',
                dataKey: 'autoCount',
                label: t('Auto Sync'),
                color: 'var(--color-primary)',
                valueFormatter: countFormatter,
              },
              {
                id: 'de-registration',
                dataKey: 'deRegCount',
                label: t('De-Reg'),
                color: 'var(--color-primary-dark)',
                minBarSize: 3,
                valueFormatter: countFormatter,
              },
            ]}
            layout="horizontal"
            height={320}
            grid={{ vertical: true }}
            borderRadius={3}
            margin={{ top: 16, right: 16, bottom: 8, left: 8 }}
            sx={chartSx}
          />
        </Card>
      </div>
    </div>
  );
};

export default DashboardCharts;
