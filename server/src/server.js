import express from 'express';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';
import projectsRouter from './rest/projects.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON bodies

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// REST API Routes
app.use('/api/projects', projectsRouter);

// GraphQL API Route
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: resolvers,
  graphiql: true, // Enable GraphiQL interface for development
  customFormatErrorFn: (error) => {
    console.error('GraphQL Error:', error);
    return {
      message: error.message,
      locations: error.locations,
      path: error.path
    };
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Mock API Server',
    endpoints: {
      rest: {
        projects: '/api/projects'
      },
      graphql: '/graphql',
      health: '/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 Mock API Server is running!

📍 Server URL: http://localhost:${PORT}

📚 Available endpoints:
   - REST API:     http://localhost:${PORT}/api/projects
   - GraphQL API:  http://localhost:${PORT}/graphql
   - GraphiQL UI:  http://localhost:${PORT}/graphql (open in browser)
   - Health check: http://localhost:${PORT}/health

💡 Press Ctrl+C to stop the server
  `);
});
