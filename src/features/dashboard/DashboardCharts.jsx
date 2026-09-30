import React, { useMemo } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
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

const DashboardCharts = ({ trendData = [], operatorData = [] }) => {
  const { t, locale } = usePreferences();

  const compactFormatter = useMemo(
    () => new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }),
    [locale]
  );

  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }),
    [locale]
  );

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

  const indexFormatter = (value) =>
    value == null ? '' : `${Number(value).toFixed(1)}`;

  const countFormatter = (value) =>
    value == null ? '' : numberFormatter.format(Number(value));

  return (
    <div className="grid grid-cols-1 min-[1760px]:grid-cols-2 gap-4 items-start">
      <Card
        title="Recent 6-Month EIR Trajectory"
        subtitle="Relative movement · Oct 2025 = 100"
        bodyClassName="p-3 sm:p-4"
        className="min-w-0"
      >
        <div aria-label={t('Recent 6-Month EIR Trajectory')}>
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
        </div>
      </Card>

      <Card
        title="Operator Sync Breakdown"
        subtitle="Auto Sync vs De-Registration by operator"
        bodyClassName="p-3 sm:p-4"
        className="min-w-0"
      >
        <div aria-label={t('Operator Sync Breakdown')}>
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
                valueFormatter: (value) =>
                  value == null ? '' : compactFormatter.format(Number(value)),
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
        </div>
      </Card>
    </div>
  );
};

export default DashboardCharts;
