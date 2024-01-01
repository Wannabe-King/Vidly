const request = require('supertest')
const mongoose = require('mongoose')
const { Genre } = require('../../models/genre')
const { app } = require('../../index');


describe('/api/genres', () => {
    beforeEach(async () => {
        // Clear the Genre collection before each test
        await Genre.deleteMany({});
    })
    afterAll(async () => {
        // Close the mongoose connection after all tests
        await mongoose.connection.close();
    })
    describe('GET/', () => {
        it('should return a list of genres', async () => {
            // Insert some test genres into the database
            Genre.collection.insertMany([{ name: 'genre1' }, { name: 'genre2' }])

            // Make a GET request to the /api/genres endpoint
            const res = await request(app).get('/api/genres')

            // Assertions
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy()
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy()

        })
    })

    describe('GET/:id', () => {
        it('should return a genre if valid id is passed', async () => {
            const genre = new Genre({ name: 'genre1' })
            await genre.save()
          const value= encodeURI(`/api/genres/${genre._id}`)
            const res = await request(app).get(value)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('name', genre.name)
        })
    })
})