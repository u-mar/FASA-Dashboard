"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Brain,
  Lightbulb,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

interface Insight {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  category: string;
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

interface Prediction {
  metric: string;
  current: number;
  predicted: number;
  confidence: number;
  timeframe: string;
  trend: 'increasing' | 'decreasing' | 'stable';
}

interface Recommendation {
  priority: 'critical' | 'high' | 'medium' | 'low';
  area: string;
  title: string;
  description: string;
  expectedImpact: string;
  effort: 'low' | 'medium' | 'high';
  actions: string[];
}

interface AIInsightsProps {
  year?: string;
}

export default function AIInsights({ year }: AIInsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAIInsights();
  }, [year]);

  const fetchAIInsights = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ai-insights${year ? `?year=${year}` : ''}`);
      if (!response.ok) throw new Error('Failed to fetch AI insights');
      
      const data = await response.json();
      setInsights(data.insights || []);
      setPredictions(data.predictions || []);
      setRecommendations(data.recommendations || []);
      setError(null);
    } catch (err) {
      setError('Failed to load AI insights');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'success': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getInsightVariant = (type: string) => {
    switch (type) {
      case 'critical': return 'destructive';
      case 'warning': return 'default';
      case 'success': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Decision Support System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
              <p className="text-muted-foreground">Analyzing data and generating insights...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const criticalCount = insights.filter(i => i.type === 'critical').length;
  const warningCount = insights.filter(i => i.type === 'warning').length;
  const successCount = insights.filter(i => i.type === 'success').length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Critical Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{criticalCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{warningCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Positive Developments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{successCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Action Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recommendations.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Predictions
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Recommendations
          </TabsTrigger>
        </TabsList>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-Generated Insights
              </CardTitle>
              <CardDescription>
                Automated analysis of your business metrics and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                {insights.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No insights available at this time</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {insights.map((insight) => (
                      <Alert key={insight.id} variant={getInsightVariant(insight.type)}>
                        <div className="flex items-start gap-3">
                          {getInsightIcon(insight.type)}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <AlertTitle className="mb-0">{insight.title}</AlertTitle>
                              <Badge variant="outline" className="ml-2">
                                {insight.category}
                              </Badge>
                            </div>
                            <AlertDescription className="text-sm">
                              {insight.description}
                            </AlertDescription>
                            
                            {insight.metrics && (
                              <div className="flex gap-4 text-xs mt-2 pt-2 border-t">
                                <div>
                                  <span className="text-muted-foreground">Current: </span>
                                  <span className="font-semibold">{insight.metrics.current.toFixed(1)}</span>
                                </div>
                                {insight.metrics.previous !== undefined && (
                                  <div>
                                    <span className="text-muted-foreground">Previous: </span>
                                    <span className="font-semibold">{insight.metrics.previous.toFixed(1)}</span>
                                  </div>
                                )}
                                {insight.metrics.change !== undefined && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-muted-foreground">Change: </span>
                                    <span className={`font-semibold ${insight.metrics.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                      {insight.metrics.change >= 0 ? '+' : ''}{insight.metrics.change.toFixed(1)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}

                            {insight.recommendations && insight.recommendations.length > 0 && (
                              <div className="mt-3 pt-3 border-t">
                                <div className="flex items-center gap-2 mb-2">
                                  <Lightbulb className="h-4 w-4" />
                                  <span className="text-sm font-semibold">Recommended Actions:</span>
                                </div>
                                <ul className="space-y-1 ml-6">
                                  {insight.recommendations.map((rec, idx) => (
                                    <li key={idx} className="text-sm list-disc">{rec}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </Alert>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Predictive Analytics
              </CardTitle>
              <CardDescription>
                AI-powered forecasts based on historical trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              {predictions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No predictions available at this time</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {predictions.map((pred, idx) => (
                    <Card key={idx}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{pred.metric}</CardTitle>
                          {getTrendIcon(pred.trend)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Current Value</p>
                            <p className="text-2xl font-bold">{pred.current.toFixed(1)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Predicted Value</p>
                            <p className="text-2xl font-bold flex items-center gap-2">
                              {pred.predicted.toFixed(1)}
                              {pred.predicted > pred.current ? (
                                <ArrowUpRight className="h-5 w-5 text-green-500" />
                              ) : pred.predicted < pred.current ? (
                                <ArrowDownRight className="h-5 w-5 text-red-500" />
                              ) : null}
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Confidence Level</span>
                            <span className="font-semibold">{(pred.confidence * 100).toFixed(0)}%</span>
                          </div>
                          <Progress value={pred.confidence * 100} className="h-2" />
                        </div>

                        <div className="text-sm">
                          <span className="text-muted-foreground">Timeframe: </span>
                          <span className="font-medium">{pred.timeframe}</span>
                        </div>

                        <div className="text-sm">
                          <span className="text-muted-foreground">Trend: </span>
                          <Badge variant={pred.trend === 'increasing' ? 'default' : pred.trend === 'decreasing' ? 'destructive' : 'outline'}>
                            {pred.trend}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Strategic Recommendations
              </CardTitle>
              <CardDescription>
                Prioritized action items to improve performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                {recommendations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No recommendations available at this time</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recommendations.map((rec, idx) => (
                      <Card key={idx} className="border-l-4" style={{ borderLeftColor: `var(--${rec.priority})` }}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`h-2 w-2 rounded-full ${getPriorityColor(rec.priority)}`} />
                                <Badge variant="outline">{rec.priority} priority</Badge>
                                <Badge variant="secondary">{rec.area}</Badge>
                              </div>
                              <CardTitle className="text-lg">{rec.title}</CardTitle>
                            </div>
                          </div>
                          <CardDescription>{rec.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Expected Impact: </span>
                              <p className="font-medium mt-1">{rec.expectedImpact}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Effort Required: </span>
                              <Badge className="mt-1" variant={
                                rec.effort === 'low' ? 'default' : 
                                rec.effort === 'medium' ? 'secondary' : 
                                'outline'
                              }>
                                {rec.effort}
                              </Badge>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              Action Steps:
                            </p>
                            <ul className="space-y-2 ml-6">
                              {rec.actions.map((action, actionIdx) => (
                                <li key={actionIdx} className="text-sm list-decimal">
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
