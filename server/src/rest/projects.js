import { Router } from 'express';
import { randomUUID } from 'crypto';
import { getAll, getById, create, update, remove } from '../db/db.js';

const router = Router();
const COLLECTION = 'projects';

/**
 * GET /api/projects
 * Get all projects
 */
router.get('/', (req, res) => {
  console.log('GET /api/projects');
  const projects = getAll(COLLECTION);
  res.json(projects);
});

/**
 * GET /api/projects/:id
 * Get a single project by ID
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;
  console.log(`GET /api/projects/${id}`);
  
  const project = getById(COLLECTION, id);
  
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  res.json(project);
});

/**
 * POST /api/projects
 * Create a new project
 */
router.post('/', (req, res) => {
  console.log('POST /api/projects', req.body);
  
  const newProject = {
    id: randomUUID(),
    data: req.body || {}
  };
  
  const created = create(COLLECTION, newProject);
  res.status(201).json(created);
});

/**
 * PUT /api/projects/:id
 * Update an existing project
 */
router.put('/:id', (req, res) => {
  const { id } = req.params;
  console.log(`PUT /api/projects/${id}`, req.body);
  
  const existing = getById(COLLECTION, id);
  
  if (!existing) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  const updatedProject = {
    id,
    data: req.body || {}
  };
  
  const result = update(COLLECTION, id, updatedProject);
  res.json(result);
});

/**
 * DELETE /api/projects/:id
 * Delete a project
 */
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  console.log(`DELETE /api/projects/${id}`);
  
  const success = remove(COLLECTION, id);
  
  if (!success) {
    return res.status(404).json({ error: 'Project not found' });
  }
  
  res.status(204).send();
});

export default router;
