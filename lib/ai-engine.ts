/**
 * AI Decision-Making Engine for FASA Dashboard
 * Rule-based AI system for insights, predictions, and recommendations
 */

export interface Insight {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  category: 'sentiment' | 'churn' | 'response' | 'aspect' | 'competitor' | 'general';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  recommendations?: string[];
  metrics?: {
    current: number;
    previous?: number;
    change?: number;
    predicted?: number;
  };
  timestamp: Date;
}

export interface Prediction {
  metric: string;
  current: number;
  predicted: number;
  confidence: number;
  timeframe: string;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface Recommendation {
  priority: 'critical' | 'high' | 'medium' | 'low';
  area: string;
  title: string;
  description: string;
  expectedImpact: string;
  effort: 'low' | 'medium' | 'high';
  actions: string[];
}

// ===== ANOMALY DETECTION =====

export function detectAnomalies(data: any[], threshold: number = 2): Insight[] {
  const insights: Insight[] = [];

  // Detect sudden drops in sentiment
  if (data.length >= 2) {
    const latest = data[data.length - 1];
    const previous = data[data.length - 2];

    if (latest.positive && previous.positive) {
      const change = ((latest.positive - previous.positive) / previous.positive) * 100;
      
      if (change < -15) {
        insights.push({
          id: `anomaly-sentiment-drop-${Date.now()}`,
          type: 'critical',
          category: 'sentiment',
          title: 'Significant Sentiment Decline Detected',
          description: `Positive sentiment has dropped by ${Math.abs(change).toFixed(1)}% compared to the previous period. Immediate investigation recommended.`,
          impact: 'high',
          actionable: true,
          recommendations: [
            'Review recent customer complaints and negative reviews',
            'Check for service disruptions or quality issues',
            'Analyze specific aspects driving negative sentiment',
            'Schedule emergency team review meeting'
          ],
          metrics: {
            current: latest.positive,
            previous: previous.positive,
            change: change
          },
          timestamp: new Date()
        });
      } else if (change > 20) {
        insights.push({
          id: `anomaly-sentiment-spike-${Date.now()}`,
          type: 'success',
          category: 'sentiment',
          title: 'Exceptional Sentiment Improvement',
          description: `Positive sentiment increased by ${change.toFixed(1)}%. Recent initiatives are showing strong results.`,
          impact: 'high',
          actionable: true,
          recommendations: [
            'Document what changes led to this improvement',
            'Replicate successful strategies across all areas',
            'Share success story with the team'
          ],
          metrics: {
            current: latest.positive,
            previous: previous.positive,
            change: change
          },
          timestamp: new Date()
        });
      }
    }
  }

  return insights;
}

// ===== TREND ANALYSIS =====

export function analyzeTrend(data: number[]): {
  trend: 'increasing' | 'decreasing' | 'stable';
  strength: number;
  velocity: number;
} {
  if (data.length < 2) return { trend: 'stable', strength: 0, velocity: 0 };

  // Simple linear regression
  const n = data.length;
  const indices = Array.from({ length: n }, (_, i) => i);
  
  const sumX = indices.reduce((a, b) => a + b, 0);
  const sumY = data.reduce((a, b) => a + b, 0);
  const sumXY = indices.reduce((sum, x, i) => sum + x * data[i], 0);
  const sumX2 = indices.reduce((sum, x) => sum + x * x, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const velocity = slope;
  
  const avgValue = sumY / n;
  const strength = Math.abs(slope / avgValue) * 100;

  let trend: 'increasing' | 'decreasing' | 'stable';
  if (Math.abs(slope) < avgValue * 0.02) {
    trend = 'stable';
  } else if (slope > 0) {
    trend = 'increasing';
  } else {
    trend = 'decreasing';
  }

  return { trend, strength, velocity };
}

// ===== PREDICTIVE ANALYTICS =====

export function predictNextPeriod(data: number[]): Prediction {
  if (data.length < 3) {
    return {
      metric: 'Unknown',
      current: data[data.length - 1] || 0,
      predicted: data[data.length - 1] || 0,
      confidence: 0.3,
      timeframe: 'next period',
      trend: 'stable'
    };
  }

  const trendAnalysis = analyzeTrend(data);
  const current = data[data.length - 1];
  
  // Exponential moving average for prediction
  const weights = [0.5, 0.3, 0.2];
  const recentData = data.slice(-3);
  const ema = recentData.reduce((sum, val, i) => sum + val * weights[i], 0);
  
  // Add trend component
  const predicted = ema + trendAnalysis.velocity;
  
  // Calculate confidence based on data consistency
  const variance = data.reduce((sum, val) => {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    return sum + Math.pow(val - mean, 2);
  }, 0) / data.length;
  
  const cv = Math.sqrt(variance) / (data.reduce((a, b) => a + b, 0) / data.length);
  const confidence = Math.max(0.4, Math.min(0.95, 1 - cv));

  return {
    metric: 'Predicted Value',
    current,
    predicted: Math.max(0, predicted),
    confidence,
    timeframe: 'next period',
    trend: trendAnalysis.trend
  };
}

// ===== CHURN RISK ANALYSIS =====

export function analyzeChurnRisk(churnRate: number, trend: any): Insight[] {
  const insights: Insight[] = [];
  
  // Ensure churnRate is a number
  const rate = Number(churnRate) || 0;

  if (rate > 30) {
    insights.push({
      id: `churn-critical-${Date.now()}`,
      type: 'critical',
      category: 'churn',
      title: 'Critical Churn Rate Detected',
      description: `Current churn risk rate of ${rate.toFixed(1)}% is critically high. Immediate retention strategies needed.`,
      impact: 'high',
      actionable: true,
      recommendations: [
        'Launch immediate customer retention campaign',
        'Offer loyalty incentives to high-risk customers',
        'Conduct exit interviews to understand root causes',
        'Implement win-back program for recently churned customers',
        'Review and improve customer support response times'
      ],
      metrics: { current: rate },
      timestamp: new Date()
    });
  } else if (rate > 20) {
    insights.push({
      id: `churn-warning-${Date.now()}`,
      type: 'warning',
      category: 'churn',
      title: 'Elevated Churn Risk',
      description: `Churn risk at ${rate.toFixed(1)}% is above healthy levels. Proactive measures recommended.`,
      impact: 'medium',
      actionable: true,
      recommendations: [
        'Identify common patterns among high-risk customers',
        'Enhance customer engagement programs',
        'Review pricing and value proposition',
        'Improve onboarding experience for new users'
      ],
      metrics: { current: rate },
      timestamp: new Date()
    });
  } else if (rate < 10) {
    insights.push({
      id: `churn-success-${Date.now()}`,
      type: 'success',
      category: 'churn',
      title: 'Excellent Customer Retention',
      description: `Churn risk at ${rate.toFixed(1)}% indicates strong customer loyalty.`,
      impact: 'low',
      actionable: false,
      recommendations: [
        'Document successful retention strategies',
        'Maintain current customer success initiatives'
      ],
      metrics: { current: rate },
      timestamp: new Date()
    });
  }

  return insights;
}

// ===== ASPECT ANALYSIS =====

export function analyzeAspects(aspects: any[]): Recommendation[] {
  const recommendations: Recommendation[] = [];

  aspects.forEach(aspect => {
    const total = aspect.positive + aspect.negative + aspect.neutral;
    const negativeRate = (aspect.negative / total) * 100;
    const positiveRate = (aspect.positive / total) * 100;

    if (negativeRate > 40) {
      recommendations.push({
        priority: 'critical',
        area: aspect.aspect,
        title: `Critical Issue: ${aspect.aspect}`,
        description: `${aspect.aspect} has ${negativeRate.toFixed(1)}% negative sentiment - requires immediate attention.`,
        expectedImpact: `Improving ${aspect.aspect} could reduce overall churn by 5-8%`,
        effort: 'high',
        actions: [
          `Conduct deep-dive analysis on ${aspect.aspect} complaints`,
          `Form task force to address ${aspect.aspect} issues`,
          `Set specific KPIs and targets for ${aspect.aspect} improvement`,
          `Allocate resources for ${aspect.aspect} enhancement`,
          `Monitor ${aspect.aspect} metrics weekly`
        ]
      });
    } else if (negativeRate > 25) {
      recommendations.push({
        priority: 'high',
        area: aspect.aspect,
        title: `Improve ${aspect.aspect}`,
        description: `${aspect.aspect} shows ${negativeRate.toFixed(1)}% negative sentiment - optimization needed.`,
        expectedImpact: `Better ${aspect.aspect} could improve satisfaction by 10-15%`,
        effort: 'medium',
        actions: [
          `Review customer feedback on ${aspect.aspect}`,
          `Benchmark ${aspect.aspect} against competitors`,
          `Create action plan for ${aspect.aspect} improvement`,
          `Track ${aspect.aspect} improvement metrics monthly`
        ]
      });
    } else if (positiveRate > 70) {
      recommendations.push({
        priority: 'low',
        area: aspect.aspect,
        title: `Leverage ${aspect.aspect} Strength`,
        description: `${aspect.aspect} is a strong point with ${positiveRate.toFixed(1)}% positive sentiment.`,
        expectedImpact: `Highlighting ${aspect.aspect} in marketing could increase conversions by 5%`,
        effort: 'low',
        actions: [
          `Feature ${aspect.aspect} prominently in marketing materials`,
          `Gather testimonials highlighting ${aspect.aspect}`,
          `Maintain high standards for ${aspect.aspect}`
        ]
      });
    }
  });

  // Sort by priority
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  return recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

// ===== COMPETITIVE ANALYSIS =====

export function analyzeCompetitivePosition(
  farasMetrics: any,
  competitorMetrics: any[]
): Insight[] {
  const insights: Insight[] = [];

  // Find Faras in the metrics
  const faras = competitorMetrics.find(c => c.company.toLowerCase() === 'faras');
  if (!faras) return insights;

  // Calculate market position
  const sorted = [...competitorMetrics].sort((a, b) => b.value - a.value);
  const farasRank = sorted.findIndex(c => c.company.toLowerCase() === 'faras') + 1;
  const totalCompetitors = sorted.length;

  if (farasRank === 1) {
    insights.push({
      id: `competitive-leader-${Date.now()}`,
      type: 'success',
      category: 'competitor',
      title: 'Market Leadership Position',
      description: `Faras leads the market with superior performance metrics.`,
      impact: 'high',
      actionable: true,
      recommendations: [
        'Maintain competitive advantages',
        'Continue innovation to stay ahead',
        'Monitor competitors for catching-up strategies'
      ],
      timestamp: new Date()
    });
  } else if (farasRank <= totalCompetitors / 3) {
    insights.push({
      id: `competitive-strong-${Date.now()}`,
      type: 'info',
      category: 'competitor',
      title: 'Strong Competitive Position',
      description: `Faras ranks #${farasRank} out of ${totalCompetitors} competitors.`,
      impact: 'medium',
      actionable: true,
      recommendations: [
        'Identify gaps with top performers',
        'Invest in differentiation strategies',
        'Focus on unique value propositions'
      ],
      timestamp: new Date()
    });
  } else {
    const leader = sorted[0];
    const gap = leader.value - faras.value;
    
    insights.push({
      id: `competitive-gap-${Date.now()}`,
      type: 'warning',
      category: 'competitor',
      title: 'Competitive Gap Identified',
      description: `Faras ranks #${farasRank} out of ${totalCompetitors}. Gap of ${gap.toFixed(1)} points with market leader ${leader.company}.`,
      impact: 'high',
      actionable: true,
      recommendations: [
        `Study ${leader.company}'s success factors`,
        'Accelerate improvement initiatives',
        'Consider strategic partnerships or acquisitions',
        'Focus on niche market dominance'
      ],
      metrics: {
        current: faras.value,
        previous: leader.value,
        change: -gap
      },
      timestamp: new Date()
    });
  }

  return insights;
}

// ===== RESPONSE RATE ANALYSIS =====

export function analyzeResponseRate(responseRate: number): Insight[] {
  const insights: Insight[] = [];
  
  // Ensure responseRate is a number
  const rate = Number(responseRate) || 0;

  if (rate < 30) {
    insights.push({
      id: `response-critical-${Date.now()}`,
      type: 'critical',
      category: 'response',
      title: 'Critical: Low Customer Response Rate',
      description: `Only ${rate.toFixed(1)}% of customer reviews are being responded to. This severely impacts customer trust.`,
      impact: 'high',
      actionable: true,
      recommendations: [
        'Implement automated response system for common queries',
        'Hire additional customer support staff',
        'Set response time targets and KPIs',
        'Use templates for faster responses',
        'Prioritize responding to negative reviews first'
      ],
      metrics: { current: rate },
      timestamp: new Date()
    });
  } else if (rate < 60) {
    insights.push({
      id: `response-warning-${Date.now()}`,
      type: 'warning',
      category: 'response',
      title: 'Response Rate Needs Improvement',
      description: `Current response rate of ${rate.toFixed(1)}% is below industry standards (70-80%).`,
      impact: 'medium',
      actionable: true,
      recommendations: [
        'Allocate more resources to customer engagement',
        'Streamline response workflows',
        'Train team on efficient response strategies',
        'Set up response tracking dashboard'
      ],
      metrics: { current: rate },
      timestamp: new Date()
    });
  } else if (rate > 80) {
    insights.push({
      id: `response-success-${Date.now()}`,
      type: 'success',
      category: 'response',
      title: 'Excellent Customer Engagement',
      description: `Outstanding ${rate.toFixed(1)}% response rate demonstrates strong customer commitment.`,
      impact: 'medium',
      actionable: false,
      recommendations: [
        'Continue maintaining high response standards',
        'Share best practices with the team'
      ],
      metrics: { current: rate },
      timestamp: new Date()
    });
  }

  return insights;
}

// ===== COMPREHENSIVE INSIGHT GENERATION =====

export function generateComprehensiveInsights(data: {
  sentimentTrend?: any[];
  churnRate?: number;
  responseRate?: number;
  aspects?: any[];
  competitorMetrics?: any[];
  aspectChanges?: any[];
}): {
  insights: Insight[];
  predictions: Prediction[];
  recommendations: Recommendation[];
} {
  const insights: Insight[] = [];
  const predictions: Prediction[] = [];
  let recommendations: Recommendation[] = [];

  // Sentiment Analysis
  if (data.sentimentTrend && data.sentimentTrend.length > 0) {
    insights.push(...detectAnomalies(data.sentimentTrend));
    
    const positiveValues = data.sentimentTrend.map(d => d.positive || 0);
    const prediction = predictNextPeriod(positiveValues);
    prediction.metric = 'Positive Sentiment';
    predictions.push(prediction);
  }

  // Churn Analysis
  if (data.churnRate !== undefined) {
    insights.push(...analyzeChurnRisk(data.churnRate, null));
  }

  // Response Rate Analysis
  if (data.responseRate !== undefined) {
    insights.push(...analyzeResponseRate(data.responseRate));
  }

  // Aspect Analysis
  if (data.aspects && data.aspects.length > 0) {
    recommendations = analyzeAspects(data.aspects);
  }

  // Competitive Analysis
  if (data.competitorMetrics && data.competitorMetrics.length > 0) {
    insights.push(...analyzeCompetitivePosition(null, data.competitorMetrics));
  }

  // Aspect Changes Analysis
  if (data.aspectChanges && data.aspectChanges.length > 0) {
    const topImprovement = data.aspectChanges[0];
    const topDecline = data.aspectChanges[data.aspectChanges.length - 1];

    const improvementChange = Number(topImprovement.rate_change) || 0;
    const declineChange = Number(topDecline.rate_change) || 0;

    if (improvementChange > 10) {
      insights.push({
        id: `aspect-improvement-${Date.now()}`,
        type: 'success',
        category: 'aspect',
        title: `Major Improvement in ${topImprovement.aspect}`,
        description: `${topImprovement.aspect} sentiment improved by ${improvementChange.toFixed(1)} percentage points.`,
        impact: 'high',
        actionable: true,
        recommendations: [
          `Document what drove ${topImprovement.aspect} improvement`,
          'Apply similar strategies to other aspects',
          `Feature ${topImprovement.aspect} improvements in customer communications`
        ],
        metrics: {
          current: Number(topImprovement.current_rate) || 0,
          previous: Number(topImprovement.previous_rate) || 0,
          change: improvementChange
        },
        timestamp: new Date()
      });
    }

    if (declineChange < -10) {
      insights.push({
        id: `aspect-decline-${Date.now()}`,
        type: 'critical',
        category: 'aspect',
        title: `Urgent: ${topDecline.aspect} Deteriorating`,
        description: `${topDecline.aspect} sentiment declined by ${Math.abs(declineChange).toFixed(1)} percentage points.`,
        impact: 'high',
        actionable: true,
        recommendations: [
          `Immediate investigation into ${topDecline.aspect} issues`,
          `Allocate emergency resources to fix ${topDecline.aspect}`,
          'Communicate with affected customers',
          'Set up daily monitoring for this aspect'
        ],
        metrics: {
          current: Number(topDecline.current_rate) || 0,
          previous: Number(topDecline.previous_rate) || 0,
          change: declineChange
        },
        timestamp: new Date()
      });
    }
  }

  return { insights, predictions, recommendations };
}

// ===== EXECUTIVE SUMMARY GENERATOR =====

export function generateExecutiveSummary(insights: Insight[], predictions: Prediction[]): string {
  const critical = insights.filter(i => i.type === 'critical').length;
  const warnings = insights.filter(i => i.type === 'warning').length;
  const success = insights.filter(i => i.type === 'success').length;

  let summary = `# AI-Generated Executive Summary\n\n`;
  
  if (critical > 0) {
    summary += `🔴 **${critical} Critical Issue${critical > 1 ? 's' : ''} Detected** - Immediate action required\n\n`;
  }
  
  if (warnings > 0) {
    summary += `⚠️ **${warnings} Warning${warnings > 1 ? 's' : ''}** - Attention needed\n\n`;
  }
  
  if (success > 0) {
    summary += `✅ **${success} Positive Development${success > 1 ? 's' : ''}** - Keep up the good work\n\n`;
  }

  if (predictions.length > 0) {
    summary += `\n## Predictive Insights\n\n`;
    predictions.forEach(pred => {
      const direction = pred.trend === 'increasing' ? '📈' : pred.trend === 'decreasing' ? '📉' : '➡️';
      summary += `${direction} **${pred.metric}**: Currently ${pred.current.toFixed(1)}, `;
      summary += `predicted ${pred.predicted.toFixed(1)} (${(pred.confidence * 100).toFixed(0)}% confidence)\n\n`;
    });
  }

  return summary;
}
