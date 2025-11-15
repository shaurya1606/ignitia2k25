import mongoose, { ConnectionStates, Mongoose } from 'mongoose';

/**
 * Shape of the cached connection object that we store on `globalThis` in development.
 * This prevents creating multiple connections when Next.js reloads modules.
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

/**
 * Augment the global type definition so TypeScript is aware of our custom
 * `mongoose` property on `globalThis`.
 */
declare global {
  var mongooseCache: MongooseCache | undefined;
}

/**
 * Connection URI for MongoDB.
 *
 * In production, this should always be defined. In development, we explicitly
 * throw if it's missing so misconfiguration fails fast.
 */
const MONGODB_URI = (() => {
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  const value = process.env.MONGODB_URI;
  if (!value) {
    throw new Error(
      'Invalid configuration: MONGODB_URI environment variable is not set.'
    );
  }
  return value;
})();

/**
 * Use a global cache in development to avoid creating multiple connections
 * when Next.js hot-reloads server code. In production, the process is long-lived
 * so a module-level singleton is sufficient, but using the same mechanism keeps
 * the logic simple and consistent.
 */
const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cached: MongooseCache = globalWithMongoose.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!globalWithMongoose.mongooseCache) {
  globalWithMongoose.mongooseCache = cached;
}

/**
 * Establishes (or reuses) a Mongoose connection to MongoDB.
 *
 * This function is safe to call multiple times; it will return the existing
 * connection if one has already been established.
 */
export async function connectToDatabase(): Promise<Mongoose> {
  // If we already have an active connection, return it immediately.
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection attempt is in-flight, wait for it to resolve.
  if (!cached.promise) {
    const options: Parameters<typeof mongoose.connect>[1] = {
      // Ensures indexes are created in the background.
      autoIndex: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, options).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  cached.conn = await cached.promise;

  return cached.conn;
}

/**
 * Convenience getter for the current connection state.
 *
 * This can be useful for logging or health checks (e.g., exposing a
 * `/api/health` route that reports database connectivity).
 */
export function getConnectionState(): ConnectionStates {
  return mongoose.connection.readyState;
}
