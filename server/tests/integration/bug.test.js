const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/app');
const Bug = require('../../src/models/Bug');
const User = require('../../src/models/User');
const { generateToken } = require('../../src/utils/auth');

let mongoServer;
let token;
let userId;
let bugId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  const user = await User.create({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
  });
  userId = user._id;
  token = generateToken(user);

  const bug = await Bug.create({
    title: 'Test Bug',
    description: 'This is a test bug',
    priority: 'medium',
    createdBy: userId,
  });
  bugId = bug._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    if (key !== 'users' && key !== 'bugs') {
      await collections[key].deleteMany({});
    }
  }
});

describe('POST /api/bugs', () => {
  it('should create a new bug when authenticated', async () => {
    const newBug = {
      title: 'New Test Bug',
      description: 'This is a new test bug',
      priority: 'high',
    };

    const res = await request(app)
      .post('/api/bugs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBug);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe(newBug.title);
    expect(res.body.description).toBe(newBug.description);
    expect(res.body.createdBy).toBe(userId.toString());
  });

  it('should return 401 if not authenticated', async () => {
    const newBug = {
      title: 'Unauthorized Bug',
      description: 'This should not be created',
      priority: 'low',
    };

    const res = await request(app)
      .post('/api/bugs')
      .send(newBug);

    expect(res.status).toBe(401);
  });

  it('should return 400 if validation fails', async () => {
    const invalidBug = {
      description: 'This bug is missing a title',
      priority: 'medium',
    };

    const res = await request(app)
      .post('/api/bugs')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidBug);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('errors');
  });
});

describe('GET /api/bugs', () => {
  it('should return all bugs', async () => {
    const res = await request(app).get('/api/bugs');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should filter bugs by status', async () => {
    const bug = await Bug.create({
      title: 'Filtered Bug',
      description: 'This bug should be filtered by status',
      priority: 'low',
      status: 'in-progress',
      createdBy: userId,
    });

    const res = await request(app)
      .get('/api/bugs?status=in-progress');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body[0].status).toBe('in-progress');
  });

  it('should paginate results', async () => {
    const bugs = [];
    for (let i = 0; i < 15; i++) {
      bugs.push({
        title: `Pagination Bug ${i}`,
        description: `Content for pagination test ${i}`,
        priority: 'medium',
        createdBy: userId,
      });
    }
    await Bug.insertMany(bugs);

    const page1 = await request(app)
      .get('/api/bugs?page=1&limit=10');
    
    const page2 = await request(app)
      .get('/api/bugs?page=2&limit=10');

    expect(page1.status).toBe(200);
    expect(page2.status).toBe(200);
    expect(page1.body.length).toBe(10);
    expect(page2.body.length).toBeGreaterThan(0);
    expect(page1.body[0]._id).not.toBe(page2.body[0]._id);
  });
});

describe('GET /api/bugs/:id', () => {
  it('should return a bug by ID', async () => {
    const res = await request(app)
      .get(`/api/bugs/${bugId}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(bugId.toString());
    expect(res.body.title).toBe('Test Bug');
  });

  it('should return 404 for non-existent bug', async () => {
    const nonExistentId = mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/bugs/${nonExistentId}`);

    expect(res.status).toBe(404);
  });
});

describe('PUT /api/bugs/:id', () => {
  it('should update a bug when authenticated as creator', async () => {
    const updates = {
      title: 'Updated Test Bug',
      description: 'This content has been updated',
      status: 'in-progress',
    };

    const res = await request(app)
      .put(`/api/bugs/${bugId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updates);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe(updates.title);
    expect(res.body.description).toBe(updates.description);
  });

  it('should return 401 if not authenticated', async () => {
    const updates = {
      title: 'Unauthorized Update',
    };

    const res = await request(app)
      .put(`/api/bugs/${bugId}`)
      .send(updates);

    expect(res.status).toBe(401);
  });

  it('should return 403 if not the creator', async () => {
    const anotherUser = await User.create({
      username: 'anotheruser',
      email: 'another@example.com',
      password: 'password123',
    });
    const anotherToken = generateToken(anotherUser);

    const updates = {
      title: 'Forbidden Update',
    };

    const res = await request(app)
      .put(`/api/bugs/${bugId}`)
      .set('Authorization', `Bearer ${anotherToken}`)
      .send(updates);

    expect(res.status).toBe(403);
  });
});

describe('DELETE /api/bugs/:id', () => {
  it('should delete a bug when authenticated as creator', async () => {
    const res = await request(app)
      .delete(`/api/bugs/${bugId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    
    const deletedBug = await Bug.findById(bugId);
    expect(deletedBug).toBeNull();
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app)
      .delete(`/api/bugs/${bugId}`);

    expect(res.status).toBe(401);
  });
});