-- This file will contain all SQL queries from the project.
-- Queries are organized by their original file location.
-- Query from: app/api/churn-rate/route.ts
WITH company_metrics AS (
  SELECT 
    company,
    COUNT(CASE WHEN churn_risk = 'high' THEN 1 END) * 100.0 / COUNT(*) as churn_rate
  FROM reviews
  WHERE EXTRACT(YEAR FROM date) = $1
  GROUP BY company
)
SELECT 
  company,
  ROUND(churn_rate::numeric, 1) as value
FROM company_metrics
ORDER BY company;
-- Query from: app/api/aspect-changes/route.ts
WITH aspect_data AS (
  SELECT 
    key AS aspect,
    value AS sentiment,
    date
  FROM reviews,
  LATERAL json_each_text(REPLACE(aspect_analysis, '''', '"')::json)
  WHERE company = 'faras'
),
sentiment_summary AS (
  SELECT
    aspect,
    EXTRACT(YEAR FROM date) AS year,
    COUNT(*) AS total_mentions,
    COUNT(CASE WHEN sentiment = 'positive' THEN 1 END) AS positive_mentions
  FROM aspect_data
  GROUP BY aspect, EXTRACT(YEAR FROM date)
  HAVING aspect IN (
    SELECT aspect 
    FROM aspect_data 
    WHERE EXTRACT(YEAR FROM date) IN ($1, $2)
    GROUP BY aspect 
    HAVING COUNT(DISTINCT EXTRACT(YEAR FROM date)) = 2
  )
),
sentiment_rate AS (
  SELECT
    aspect,
    year,
    ROUND((100.0 * positive_mentions::FLOAT / total_mentions)::NUMERIC, 2) AS positive_rate
  FROM sentiment_summary
)
SELECT 
  curr.aspect,
  curr.positive_rate - prev.positive_rate AS rate_change,
  curr.positive_rate AS current_rate,
  prev.positive_rate AS previous_rate
FROM sentiment_rate curr
JOIN sentiment_rate prev
  ON curr.aspect = prev.aspect AND curr.year = $2 AND prev.year = $1
ORDER BY rate_change DESC;
-- Queries from: app/actions.ts

-- Query from: getSentimentTrend()
SELECT 
  EXTRACT(YEAR FROM date) AS year,
  CAST(COUNT(CASE WHEN overall_sentiment = 'positive' THEN 1 END) AS INT) AS positive,
  CAST(COUNT(CASE WHEN overall_sentiment = 'negative' THEN 1 END) AS INT) AS negative,
  CAST(COUNT(CASE WHEN overall_sentiment = 'neutral'  THEN 1 END) AS INT) AS neutral
FROM reviews
WHERE company = 'faras'
GROUP BY EXTRACT(YEAR FROM date)
ORDER BY year;

-- Query from: getOverallSentiment()
select overall_sentiment,CAST(COUNT(*) AS INT) AS total
from reviews
where company = 'faras'
group by overall_sentiment;

-- Query from: getAspectMetrics() (Note: This query was commented out in the original file)
-- Your aspect metrics SQL query here

-- Query from: getSourcesVolume()
select sourcee,count(*) as volume
from reviews
where company = 'faras'
group by sourcee;

-- Query from: getSourcesSentiment()
SELECT 
  sourcee, 
  CAST(COUNT(CASE WHEN overall_sentiment = 'positive' THEN 1 END) AS INT) AS positive,
  CAST(COUNT(CASE WHEN overall_sentiment = 'negative' THEN 1 END) AS INT) AS negative,
  CAST(COUNT(CASE WHEN overall_sentiment = 'neutral'  THEN 1 END) AS INT) AS neutral
FROM reviews
WHERE company = 'faras'
GROUP BY sourcee;

-- Query from: getAspectsVolume()
SELECT 
  aspect,
  CAST(COUNT(CASE WHEN sentiment = 'positive' THEN 1 END) AS INT) AS positive,
  CAST(COUNT(CASE WHEN sentiment = 'negative' THEN 1 END) AS INT) AS negative,
  CAST(COUNT(CASE WHEN sentiment = 'neutral'  THEN 1 END) AS INT) AS neutral
FROM (
  SELECT 
    key AS aspect,
    value AS sentiment
  FROM reviews,
  LATERAL json_each_text(REPLACE(aspect_analysis, '''', '"')::json)
  WHERE company = 'faras'
) AS unpacked
GROUP BY aspect
ORDER BY aspect;

-- Query from: getEmotionAspectCooccurrence()
SELECT 
  aspect,
  CAST(COUNT(CASE WHEN overall_emotion = 'anger' THEN 1 END) AS INT) AS anger,
  CAST(COUNT(CASE WHEN overall_emotion = 'annoyance' THEN 1 END) AS INT) AS annoyance,
  CAST(COUNT(CASE WHEN overall_emotion = 'confusion'  THEN 1 END) AS INT) AS confusion,
  CAST(COUNT(CASE WHEN overall_emotion = 'curiosity'  THEN 1 END) AS INT) AS curiosity,
  CAST(COUNT(CASE WHEN overall_emotion = 'disappointment'  THEN 1 END) AS INT) AS disappointment,
  CAST(COUNT(CASE WHEN overall_emotion = 'neutral'  THEN 1 END) AS INT) AS neutral,
  CAST(COUNT(CASE WHEN overall_emotion = 'gratitude'  THEN 1 END) AS INT) AS gratitude
FROM (
  SELECT 
    key AS aspect,
    overall_emotion
  FROM reviews,
  LATERAL json_each_text(REPLACE(aspect_analysis, '''', '"')::json)
  WHERE company = 'faras'
) AS unpacked
GROUP BY aspect
ORDER BY aspect;

-- Query from: getEmotionsData()
select overall_emotion as emotion, count(*) as total
from reviews
where company = 'faras'
group by overall_emotion;

-- Query from: getAspectChanges()
WITH aspect_data AS (
  SELECT 
    key AS aspect,
    value AS sentiment,
    date
  FROM reviews,
  LATERAL json_each_text(REPLACE(aspect_analysis, '''', '"')::json)
  WHERE company = 'faras'
),
sentiment_summary AS (
  SELECT
    aspect,
    EXTRACT(YEAR FROM date) AS year,
    COUNT(*) AS total_mentions,
    COUNT(CASE WHEN sentiment = 'positive' THEN 1 END) AS positive_mentions
  FROM aspect_data
  GROUP BY aspect, EXTRACT(YEAR FROM date)
),
sentiment_rate AS (
  SELECT
    aspect,
    year,
    ROUND((100.0 * positive_mentions::FLOAT / total_mentions)::NUMERIC, 2) AS positive_rate
  FROM sentiment_summary
)
SELECT 
  curr.aspect,
  curr.positive_rate - prev.positive_rate AS rate_change,
  curr.positive_rate AS current_rate,
  prev.positive_rate AS previous_rate
FROM sentiment_rate curr
JOIN sentiment_rate prev
  ON curr.aspect = prev.aspect AND curr.year = 2025 AND prev.year = 2022
ORDER BY rate_change DESC;

-- Query from: getAspectTrends()
WITH sentiment_data AS (
  SELECT 
    key AS aspect,
    EXTRACT(YEAR FROM date) AS year,
    value AS sentiment
  FROM reviews,
    LATERAL json_each_text(REPLACE(aspect_analysis, '''', '"')::json)
  WHERE company = 'faras'
),
sentiment_summary AS (
  SELECT 
    year,
    aspect,
    COUNT(*) FILTER (WHERE sentiment = 'positive') AS pos,
    COUNT(*) FILTER (WHERE sentiment = 'negative') AS neg,
    COUNT(*) FILTER (WHERE sentiment = 'neutral') AS neu
  FROM sentiment_data
  GROUP BY year, aspect
),
percentages AS (
  SELECT 
    year,
    aspect,
    ROUND(100.0 * pos / NULLIF(pos + neg + neu, 0), 2) AS percentage
  FROM sentiment_summary
)
SELECT
  year,
  COALESCE(MAX(CASE WHEN aspect = 'accuracy' THEN percentage END), 0) AS accuracy,
  COALESCE(MAX(CASE WHEN aspect = 'app' THEN percentage END), 0) AS app,
  COALESCE(MAX(CASE WHEN aspect = 'customer support' THEN percentage END), 0) AS customer_support,
  COALESCE(MAX(CASE WHEN aspect = 'driver' THEN percentage END), 0) AS driver,
  COALESCE(MAX(CASE WHEN aspect = 'payment' THEN percentage END), 0) AS payment,
  COALESCE(MAX(CASE WHEN aspect = 'price' THEN percentage END), 0) AS price,
  COALESCE(MAX(CASE WHEN aspect = 'safety' THEN percentage END), 0) AS safety,
  COALESCE(MAX(CASE WHEN aspect = 'service' THEN percentage END), 0) AS service,
  COALESCE(MAX(CASE WHEN aspect = 'waiting time' THEN percentage END), 0) AS waiting_time
FROM percentages
GROUP BY year
ORDER BY year;

-- Query from: getChurnRate()
SELECT 
  ROUND(
      COUNT(*) FILTER (WHERE churn_risk = 'high') * 100.0 / 
      COUNT(*), 
      2
  ) AS churn_rate 
FROM reviews
where company = 'faras';

-- Query from: getResponseRate()
SELECT 
  ROUND(
      COUNT(*) FILTER (WHERE response = 'True') * 100.0 / 
      COUNT(*), 
      2
  ) AS response_rate 
FROM reviews
where sourcee != 'app_store';

-- Query from: getChurnTrend()
SELECT 
  EXTRACT(YEAR FROM date) AS year,
  ROUND(
    100.0 * AVG(CASE churn_risk
                  WHEN 'high' THEN 1
                  WHEN 'low' THEN 0
               END), 
    2
  ) AS churn_rate_percent
FROM reviews
where company = 'faras'
GROUP BY EXTRACT(YEAR FROM date)
ORDER BY year;

-- Query from: getResponseTrend()
SELECT 
  EXTRACT(YEAR FROM date) AS year,
  ROUND(
    100.0 * AVG(CASE response
                  WHEN 'True' THEN 1
                  WHEN 'False' THEN 0
               END), 
    2
  ) AS response_rate_percent
FROM reviews
where sourcee != 'app_store'
GROUP BY EXTRACT(YEAR FROM date)
ORDER BY year;

-- Queries from: getCompetitorData()

-- Query for churnRateData in getCompetitorData()
SELECT 
  company,
  ROUND(
    COUNT(*) FILTER (WHERE LOWER(churn_risk) = 'high') * 100.0 / COUNT(*),
    2
  ) AS churn_rate
FROM reviews
GROUP BY company
ORDER BY churn_rate DESC;

-- Query for responseRateData in getCompetitorData()
SELECT 
  company,
  ROUND(
    COUNT(*) FILTER (WHERE response = 'True') * 100.0 / COUNT(*),
    2
  ) AS response_rate
FROM reviews
GROUP BY company
ORDER BY response_rate DESC;

-- Query for churnTrendRawData in getCompetitorData()
SELECT 
  company,
  EXTRACT(YEAR FROM date) AS year,
  ROUND(
    100.0 * AVG(CASE LOWER(churn_risk)
                  WHEN 'high' THEN 1
                  WHEN 'low' THEN 0
               END),
    2
  ) AS churn_rate_percent
FROM reviews
GROUP BY company, EXTRACT(YEAR FROM date)
ORDER BY company, year;

-- Query for responseTrendRawData in getCompetitorData()
SELECT 
  company,
  EXTRACT(YEAR FROM date) AS year,
  ROUND(
    100.0 * AVG(CAST(
      CASE response
        WHEN 'True' THEN 1
        WHEN 'False' THEN 0
      END AS INT)
    ),
    2
  ) AS response_rate_percent
FROM reviews
GROUP BY company, EXTRACT(YEAR FROM date)
ORDER BY company, year;
-- Query from: app/api/aspect-sentiment/route.ts
WITH aspect_data AS (
  SELECT 
    company,
    key AS aspect,
    value AS sentiment
  FROM reviews,
  LATERAL json_each_text(REPLACE(aspect_analysis, '''', '"')::json)
),
aspect_sentiment AS (
  SELECT
    aspect,
    company,
    COUNT(*) FILTER (WHERE sentiment = 'positive') AS positive_count,
    COUNT(*) FILTER (WHERE sentiment = 'negative') AS negative_count,
    COUNT(*) AS total_count
  FROM aspect_data
  GROUP BY aspect, company
)
SELECT
  aspect,
  MAX(CASE WHEN company = 'faras' THEN ROUND(100.0 * positive_count / NULLIF(total_count, 0), 1) ELSE 0 END) AS faras_positive,
  MAX(CASE WHEN company = 'faras' THEN ROUND(100.0 * negative_count / NULLIF(total_count, 0), 1) ELSE 0 END) AS faras_negative,
  MAX(CASE WHEN company = 'uber' THEN ROUND(100.0 * positive_count / NULLIF(total_count, 0), 1) ELSE 0 END) AS uber_positive,
  MAX(CASE WHEN company = 'uber' THEN ROUND(100.0 * negative_count / NULLIF(total_count, 0), 1) ELSE 0 END) AS uber_negative,
  MAX(CASE WHEN company = 'little' THEN ROUND(100.0 * positive_count / NULLIF(total_count, 0), 1) ELSE 0 END) AS little_positive,
  MAX(CASE WHEN company = 'little' THEN ROUND(100.0 * negative_count / NULLIF(total_count, 0), 1) ELSE 0 END) AS little_negative,
  MAX(CASE WHEN company = 'bolt' THEN ROUND(100.0 * positive_count / NULLIF(total_count, 0), 1) ELSE 0 END) AS bolt_positive,
  MAX(CASE WHEN company = 'bolt' THEN ROUND(100.0 * negative_count / NULLIF(total_count, 0), 1) ELSE 0 END) AS bolt_negative
FROM aspect_sentiment
GROUP BY aspect
ORDER BY aspect;
-- Query from: app/api/aspect-trend/route.ts
WITH aspect_data AS (
  SELECT 
    company,
    key AS aspect,
    value AS sentiment,
    EXTRACT(YEAR FROM date) AS year
  FROM reviews,
  LATERAL json_each_text(REPLACE(aspect_analysis, '''', '"')::json)
),
aspect_sentiment_by_year AS (
  SELECT
    aspect,
    company,
    year,
    COUNT(*) FILTER (WHERE sentiment = 'positive') AS positive_count,
    COUNT(*) FILTER (WHERE sentiment = 'negative') AS negative_count,
    COUNT(*) AS total_count,
    ROUND(100.0 * COUNT(*) FILTER (WHERE sentiment = 'positive') / NULLIF(COUNT(*), 0), 1) AS positive_percentage,
    ROUND(100.0 * COUNT(*) FILTER (WHERE sentiment = 'negative') / NULLIF(COUNT(*), 0), 1) AS negative_percentage
  FROM aspect_data
  GROUP BY aspect, company, year
)
SELECT
  aspect,
  company,
  year,
  positive_percentage AS positive_value,
  negative_percentage AS negative_value
FROM aspect_sentiment_by_year
WHERE aspect IN (
  SELECT aspect 
  FROM aspect_data 
  GROUP BY aspect 
  ORDER BY COUNT(*) DESC 
  LIMIT 5
)
ORDER BY aspect, company, year;
-- Query from: app/api/available-years/route.ts
SELECT DISTINCT 
  EXTRACT(YEAR FROM date)::integer as year 
FROM reviews
ORDER BY year DESC;
-- Query from: app/api/churn-trend-comparison/route.ts
SELECT 
  EXTRACT(YEAR FROM date) AS year,
  company,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE LOWER(churn_risk) = 'high') / COUNT(*),
    1
  ) AS churn_rate
FROM reviews
GROUP BY EXTRACT(YEAR FROM date), company
ORDER BY year, company;
-- Query from: app/api/ratings/route.ts
SELECT 
  company,
  ROUND(AVG(rating), 1) AS rating
FROM reviews
GROUP BY company
ORDER BY rating DESC;
-- Query from: app/api/response-rate/route.ts
WITH company_metrics AS (
  SELECT 
    company,
    COUNT(CASE WHEN response = 'True' THEN 1 END) * 100.0 / COUNT(*) as response_rate
  FROM reviews
  WHERE EXTRACT(YEAR FROM date) = $1
  GROUP BY company
)
SELECT 
  company,
  ROUND(response_rate::numeric, 1) as value
FROM company_metrics
ORDER BY company;
-- Query from: app/api/response-trend-comparison/route.ts
SELECT 
  EXTRACT(YEAR FROM date) AS year,
  company,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE response = 'True') / COUNT(*),
    1
  ) AS response_rate
FROM reviews
GROUP BY EXTRACT(YEAR FROM date), company
ORDER BY year, company;
-- Query from: app/api/sentiment-comparison/route.ts
SELECT 
  company,
  ROUND(
    COUNT(*) FILTER (WHERE overall_sentiment = 'positive') * 100.0 / COUNT(*),
    1
  ) AS positive,
  ROUND(
    COUNT(*) FILTER (WHERE overall_sentiment = 'negative') * 100.0 / COUNT(*),
    1
  ) AS negative,
  ROUND(
    COUNT(*) FILTER (WHERE overall_sentiment = 'neutral') * 100.0 / COUNT(*),
    1
  ) AS neutral
FROM reviews
GROUP BY company
ORDER BY positive DESC;
-- Query from: app/api/sentiment-trend-comparison/route.ts
SELECT 
  TO_CHAR(date, 'Mon') AS month,
  company,
  ROUND(
    COUNT(*) FILTER (WHERE overall_sentiment = 'positive') * 100.0 / 
    NULLIF(COUNT(*), 0),
    1
  ) AS positive_percentage
FROM reviews
WHERE EXTRACT(YEAR FROM date) = 2025
GROUP BY TO_CHAR(date, 'Mon'), company, EXTRACT(MONTH FROM date)
ORDER BY EXTRACT(MONTH FROM date), company;