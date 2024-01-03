const request = require('supertest')
const express= require('express')
const mongoose = require('mongoose')
const { Genre } = require('../../models/genre')
const { User } = require('../../models/user')
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
        // it('should return a genre if valid id is passed', async () => {
        //     const genre = new Genre({ name: 'genre1' })
        //     await genre.save()
        //     const res = await request(app).get('/api/genres/'+genre._id)

        //     expect(res.status).toBe(200)
        //     expect(res.body).toHaveProperty('name', genre.name)
        // })

        it('should return 404 if invalid genre id', async () => {
            const res = await request(app).get('/api/genres/1' )
            expect(res.status).toBe(404)
        })
    })

    describe('POST /',()=>{
        it('should return 401 if client is not logged in',async ()=>{
            const res=await request(app)
                .post('/api/genres')
                .send({name:'genre1'});

            expect(res.status).toBe(401)
        })

        // it('should return 400 if genre is less than 5 character',async ()=>{
        //     const token=new User().generateAuthToken();

        //     const res=await request(app)
        //         .post('/api/genres')
        //         .set('x-auth-token',token)
        //         .send({name:'genr'});

        //     expect(res.status).toBe(401)
        // })

        it('should save the genre if it is valid',async()=>{
            const token = new User().generateAuthToken()
            const res=await request(app)
                .post('/api/genres')
                .set('x-auth-token',token)
                .send({name:'genre1'});

            const genre= await Genre.find({name:'gnere1'});

            expect(genre).not.toBeNull();
        })

        // it('should return the genre if it is valid',async()=>{
        //     const token = new User().generateAuthToken()
        //     const res=await request(app)
        //         .post('/api/genres')
        //         .set('x-auth-token',token)
        //         .send({name:'genre1'});

        //     expect(res.body).toHaveProperty('_id')
        //     expect(res.body).toHaveProperty('name','genre1')
        // })
    })
})