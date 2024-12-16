import { describe, it, expect } from 'vitest';
import request from 'supertest';
import {server} from "../../../app.js";
const postRegister = (data) => request(server).post('/register').send(data).set('Accept', 'application/json');

describe('/register Route', () => {
    it('GET / should return the HTML file', async () => {
        const res = await request(server).get('/register');

        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toContain('text/html');
        expect(res.text).toContain('<title>Messages Inc</title>');
    })

    it('Should return an 400 if required fields are missing', async () => {
        const res = await postRegister({
            username: '',
            email: '',
            password: '',
            confirm_password: ''
        });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            errors: [
                {message: "username is required"},
                {message: "username must contain only letters and numbers"},
                {message: "password is required"},
                {message: "password must be at least 8 characters long"},
                {message: "email is required"},
                {message: "email must be a valid email"},
            ],
        });
    })

    it('Should return an 400 if email is invalid', async () => {
        const res = await postRegister({username: "", email: 'test.com', password: 'test', confirm_password: ''});

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            errors: [
                {message: "username is required"},
                {message: "username must contain only letters and numbers"},
                {message: "password must be at least 8 characters long"},
                {message: "email must be a valid email"},
                {message: "Confirm Password does not match Password"},
            ],
        });
    })

    it('Should return an 400 if password is invalid', async () => {
        const res = await postRegister({
            username: 'afsas',
            email: 'test@example.com',
            password: '',
            confirm_password: ''
        });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            errors: [
                {message: "password is required"},
                {message: "password must be at least 8 characters long"},
            ],
        });
    })

    it('Should return an 400 if username is invalid', async () => {
        const res = await postRegister({
            username: 'afsas@',
            email: 'test@example.com',
            password: 'test@123',
            confirm_password: 'test@123'
        });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            errors: [
                {message: "username must contain only letters and numbers"},
            ],
        });
    })

    it('Should return an 400 if confirm password is invalid', async () => {
        const res = await postRegister({
            username: 'afsas',
            email: 'test@example.com',
            password: 'test@423',
            confirm_password: 'test@123'
        });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            errors: [
                {message: 'Confirm Password does not match Password'}
            ]
        })
    })

    it('Should return an 409 if user already exists', async () => {
        const res = await postRegister({
            username: 'test',
            email: "test@example.com",
            password: 'test@123',
            confirm_password: 'test@123'
        });

        expect(res.status).toBe(409);
        expect(res.body).toEqual({
            message: 'User already exists',
            success: false,
        })
    })

    it('should return 400 for invalid characters in email', async () => {
        const res = await postRegister({
            username: 'afsas',
            email: "' OR 1=1 --",
            password: 'test@123',
            confirm_password: 'test@123'
        });

        expect(res.status).toBe(400);
    })
});