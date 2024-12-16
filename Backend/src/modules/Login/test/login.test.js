import { describe, it, expect } from 'vitest';
import request from 'supertest';
import {server} from "../../../app.js";

describe('/login Route', () => {
    it('GET / should return the HTML file', async () => {
        const res = await request(server)
            .get('/login');

        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toContain('text/html');
        expect(res.text).toContain('<title>Messages Inc</title>');
        expect(res.text).toContain('<div id="root"></div>');
    })

    it('should return 400 if required fields are missing', async () => {
        const res = await request(server)
            .post('/login')
            .send({ email: '' , password:''})
            .set('Accept', 'application/json');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            errors:[
                {message:"email is required"},
                {message: "email must be a valid email"},
                {message:"password is required"},
                {message:"password must be at least 8 characters long"},
            ]
        });
    });

    it("Should return 400 if password is less than 8 characters long", async () => {
        const res = await request(server)
            .post('/login')
            .send({email:"test@example.com", password:'123'})
            .set('Accept', 'application/json')

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            errors:[
                {message:"password must be at least 8 characters long"},
            ]
        })
    });

    it("Should return 400 if email not valid", async () => {
        const res = await request(server)
            .post('/login')
            .send({email:"test.com", password:'123456789'})
            .set('Accept', 'application/json')

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            errors:[
                {message:"email must be a valid email"},
            ]
        })
    });

    it('should return 400 if email is missing', async () => {
        const res = await request(server)
            .post('/login')
            .send({ password: 'test@123' })
            .set('Accept', 'application/json');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            errors: [
                { message: "email is required" },
                {message: "email must be a valid email"},
            ],
        });
    });

    it('should return 400 if password is missing', async () => {
        const res = await request(server)
            .post('/login')
            .send({ email: 'test@example.com' })
            .set('Accept', 'application/json');

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            errors: [
                { message: "password is required" },
                {message: "password must be at least 8 characters long",}
            ],
        });
    });

    it('should return 401 for incorrect email or password', async () => {
        const res = await request(server)
            .post('/login')
            .send({ email: 'wrong@example.com', password: 'wrongpassword' })
            .set('Accept', 'application/json');

        expect(res.status).toBe(401);
        expect(res.body).toEqual({
            success: false,
            message: "Invalid Email or Password",
        });
    });

    it('should return 400 for invalid characters in email', async () => {
        const res = await request(server)
            .post('/login')
            .send({ email: "' OR 1=1 --", password: 'test@123' })
            .set('Accept', 'application/json');

        expect(res.status).toBe(400);
        expect(res.body.errors).toContainEqual({ message: "email must be a valid email" });
    });

    it("Should return 400 if password is wrong", async () => {
        const res = await request(server)
            .post('/login')
            .send({email:"test@gamail.com", password:'test@as23'})
            .set('Accept', 'application/json')

        expect(res.status).toBe(401);
        expect(res.body).toEqual({success:false, message:"Invalid Email or Password"})
    })

    it("Should return 200 and success:true when login with correct email and password", async () => {
        const res = await request(server)
            .post('/login')
            .send({email:"test@gamail.com", password:'test@123'})
            .set('Accept', 'application/json')

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({success:true})
    });

});