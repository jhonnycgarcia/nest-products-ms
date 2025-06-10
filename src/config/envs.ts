import 'dotenv/config';
import * as joi from 'joi';

interface EnvConfig {
    PORT: number;
    DATABASE_URL: string;
    /**
     * URLs de los servidores NATS.
     * Para un único servidor: NATS_SERVERS="nats://localhost:4222"
     * Para múltiples servidores, separar con punto y coma: NATS_SERVERS="nats://server1:4222;nats://server2:4222"
     */
    NATS_SERVERS: string[];
}

const envSchema = joi.object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
}).unknown(true);

const { value: envConfig, error } = envSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(';'),
});

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvConfig = envConfig;

export const envs = {
    PORT: envVars.PORT,
    DATABASE_URL: envVars.DATABASE_URL,
    NATS_SERVERS: envVars.NATS_SERVERS,
}
