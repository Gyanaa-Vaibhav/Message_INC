import { describe, it, expect } from 'vitest';
import request from 'supertest';
import {server} from "../../../app.js";
const postGuest = (data) => request(server).post('/register').send(data).set('Accept', 'application/json');

describe('/Guest route', () => {
    it('should return 200', async () => {
        const res = await request(server).get('/guest');

        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toBe('text/html; charset=UTF-8');
    });

    it('should return 200 /:name', async () => {
        const res = await request(server).get('/guest/John');

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            success:true,
            username: "John",
        });
    });

    it('should return 200 /:name', async () => {
        const res = await request(server).get('/guest/guest');

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            success:true,
            username: "guest",
        });
    });
})