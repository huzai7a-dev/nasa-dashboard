const request = require('supertest');

const app = require('../../app');
const { connectToMongo, disconnectFromMongo } = require('../../utils/mongo');
const { loadPlanets } = require('../../models/planets.model');

describe('Testing Launch API',()=> {
    beforeAll(async()=> {
        await connectToMongo();
        await loadPlanets();
    });

    afterAll(async()=> {
        await disconnectFromMongo();
    });
    
    describe('Test Get /launch',()=> {
        test('It should respond with 200',async ()=> {
            const response = await request(app)
            .get('/v1/launches')
            .expect('Content-Type', /json/)
            .expect(200)
        })
    });
    
    describe('Test Post /launch',()=> {
        test('It should respond with 201',async()=> {
            const response = await request(app)
            .post('/v1/launches')
            .send({
                flightNumber: 100,
                mission: 'Kepler Exploration X',
                rocket: 'Explorer IS1',
                launchDate: new Date('December 27, 2030'),
                target: 'Kepler-442 b',
                customer: ['ZTM', 'NASA'],
                upcoming: true,
                success: true,
            })
            .expect('Content-Type', /json/)
            .expect(201)
        })
    })
});