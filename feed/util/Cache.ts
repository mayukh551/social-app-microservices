import * as redis from 'redis';

export default class FeedCache {

    private client: any;

    constructor() {
        this.client = redis.createClient();
        this.client.connect().then(() => console.log('Connected to Redis'));
    }

    set(key: string, value: string, ttl?: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.client.set(key, value, (error: any, result: any) => {
                if (error) {
                    reject(error);
                } else {
                    if (ttl) {
                        this.client.expire(key, ttl);
                    }
                    resolve(true);
                }
            });
        });
    }

    get(key: string): Promise<string | null> {
        return new Promise((resolve, reject) => {
            this.client.get(key, (error: any, result: any) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
        });
    }

    expire(key: string, ttl: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.client.expire(key, ttl, (error: any, result: any) => {
                if (error)
                    reject(error);
                else
                    resolve(true);

            });
        });
    }
}