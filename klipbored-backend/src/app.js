require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const clipboardRoutes = require('./routes/clipboardRoutes');
const cors = require('cors');
const client = require('prom-client');

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());

// Create a Registry which registers the metrics
const register = new client.Registry();

// Collect default metrics
client.collectDefaultMetrics({ register });

// Define custom metrics (optional)
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [50, 100, 200, 300, 400, 500, 1000] // Define the range of durations
});

// Register the custom histogram
register.registerMetric(httpRequestDurationMicroseconds);

// Middleware to record metrics for each request
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.route?.path || req.url, code: res.statusCode });
  });
  next();
});

// Use the clipboard routes
app.use('/api', clipboardRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to Klipbored!');
});

// Custom metrics for frontend
const pageLoadTimeHistogram = new client.Histogram({
  name: 'frontend_page_load_time_ms',
  help: 'Page load time in ms',
  buckets: [100, 200, 300, 500, 1000, 2000, 3000, 5000]
});

const clipboardClicksCounter = new client.Counter({
  name: 'frontend_clipboard_clicks_total',
  help: 'Total number of clicks on the clipboard component'
});

const fileUploadClicksCounter = new client.Counter({
  name: 'frontend_file_upload_clicks_total',
  help: 'Total number of clicks on the file upload component'
});

register.registerMetric(pageLoadTimeHistogram);
register.registerMetric(clipboardClicksCounter);
register.registerMetric(fileUploadClicksCounter);

// Endpoint to receive metrics from frontend
app.post('/api/metrics', (req, res) => {
  const { event, value } = req.body;
  if (event === 'page_load_time_ms') {
    pageLoadTimeHistogram.observe(value);
  } else if (event === 'clipboard_clicks') {
    clipboardClicksCounter.inc(value);
  } else if (event === 'file_upload_clicks') {
    fileUploadClicksCounter.inc(value);
  }
  res.status(200).send('Metric received');
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.end(await register.metrics());
  });  

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
    
});
