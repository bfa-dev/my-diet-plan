import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  waistSize?: number;
}

interface WeightChartProps {
  entries: WeightEntry[];
}

export function WeightChart({ entries }: WeightChartProps) {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 80; // Account for padding
  const chartHeight = 200;

  if (entries.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Henüz veri yok</Text>
        <Text style={styles.emptySubtext}>
          Ölçüm ekleyerek grafiği görüntüleyin
        </Text>
      </View>
    );
  }

  // Sort entries by date
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate chart dimensions and scales
  const weights = sortedEntries.map(entry => entry.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const weightRange = maxWeight - minWeight || 1; // Avoid division by zero

  // Add some padding to the range
  const paddedMin = minWeight - weightRange * 0.1;
  const paddedMax = maxWeight + weightRange * 0.1;
  const paddedRange = paddedMax - paddedMin;

  // Calculate points for the line chart
  const points = sortedEntries.map((entry, index) => {
    const x = (index / Math.max(sortedEntries.length - 1, 1)) * chartWidth;
    const y = chartHeight - ((entry.weight - paddedMin) / paddedRange) * chartHeight;
    return { x, y, weight: entry.weight, date: entry.date };
  });

  // Create SVG path for the line
  const pathData = points.reduce((path, point, index) => {
    const command = index === 0 ? 'M' : 'L';
    return `${path} ${command} ${point.x} ${point.y}`;
  }, '');

  // Create area path (for gradient fill)
  const areaPath = `${pathData} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'short'
    });
  };

  const getWeightTrend = () => {
    if (sortedEntries.length < 2) return 'neutral';
    const firstWeight = sortedEntries[0].weight;
    const lastWeight = sortedEntries[sortedEntries.length - 1].weight;
    const change = lastWeight - firstWeight;
    
    if (Math.abs(change) < 0.1) return 'neutral';
    return change > 0 ? 'up' : 'down';
  };

  const getTrendColor = () => {
    const trend = getWeightTrend();
    switch (trend) {
      case 'up': return '#EF4444';
      case 'down': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getTrendText = () => {
    if (sortedEntries.length < 2) return 'Veri yetersiz';
    
    const firstWeight = sortedEntries[0].weight;
    const lastWeight = sortedEntries[sortedEntries.length - 1].weight;
    const change = lastWeight - firstWeight;
    const absChange = Math.abs(change);
    
    if (absChange < 0.1) return 'Stabil';
    
    const direction = change > 0 ? 'artış' : 'azalış';
    return `${absChange.toFixed(1)} kg ${direction}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        {/* Y-axis labels */}
        <View style={styles.yAxisLabels}>
          <Text style={styles.axisLabel}>{paddedMax.toFixed(1)}</Text>
          <Text style={styles.axisLabel}>{((paddedMax + paddedMin) / 2).toFixed(1)}</Text>
          <Text style={styles.axisLabel}>{paddedMin.toFixed(1)}</Text>
        </View>

        {/* Chart area */}
        <View style={styles.chartArea}>
          <svg width={chartWidth} height={chartHeight} style={styles.svg}>
            {/* Grid lines */}
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8FBC8F" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#8FBC8F" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            
            {/* Horizontal grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
              <line
                key={index}
                x1="0"
                y1={ratio * chartHeight}
                x2={chartWidth}
                y2={ratio * chartHeight}
                stroke="#E5E7EB"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            ))}

            {/* Area fill */}
            {points.length > 1 && (
              <path
                d={areaPath}
                fill="url(#areaGradient)"
              />
            )}

            {/* Line */}
            {points.length > 1 && (
              <path
                d={pathData}
                fill="none"
                stroke="#8FBC8F"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data points */}
            {points.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#8FBC8F"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
            ))}
          </svg>

          {/* X-axis labels */}
          <View style={styles.xAxisLabels}>
            {points.map((point, index) => (
              <Text key={index} style={[styles.axisLabel, { left: point.x - 20 }]}>
                {formatDate(point.date)}
              </Text>
            ))}
          </View>
        </View>
      </View>

      {/* Chart summary */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Trend</Text>
          <Text style={[styles.summaryValue, { color: getTrendColor() }]}>
            {getTrendText()}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Son Ölçüm</Text>
          <Text style={styles.summaryValue}>
            {sortedEntries[sortedEntries.length - 1]?.weight} kg
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Ölçüm Sayısı</Text>
          <Text style={styles.summaryValue}>{entries.length}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  chartContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  yAxisLabels: {
    width: 40,
    height: 200,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  chartArea: {
    flex: 1,
    position: 'relative',
  },
  svg: {
    backgroundColor: 'transparent',
  },
  xAxisLabels: {
    flexDirection: 'row',
    position: 'relative',
    marginTop: 8,
    height: 20,
  },
  axisLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    position: 'absolute',
    textAlign: 'center',
    width: 40,
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
});