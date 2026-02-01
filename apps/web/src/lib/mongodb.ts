import mongoose, { ConnectionStates, Mongoose } from 'mongoose';

/**
 * Shape of the cached connection object stored on `globalThis` in development.
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

// Load and validate Mongo URI
const MONGODB_URI: string = (() => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      'Invalid configuration: MONGODB_URI environment variable is not set.'
    );
  }

  return uri;
})();

// Use cached connection in dev
const globalWithMongoose = globalThis as typeof globalThis & {
  mongoose?: MongooseCache;
};

const cached: MongooseCache = globalWithMongoose.mongoose ?? {
  conn: null,
  promise: null,
};

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = cached;
}

/**
 * Establish a Mongoose connection.
 */
export async function connectToDatabase(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const isDev = process.env.NODE_ENV !== 'production';

    /**
     * TLS FIX:
     * MongoDB Atlas might throw `self-signed certificate` if
     * the system CA chain is outdated or Windows trust-store mismatches.
     *
     * The following flags ensure secure but compatible TLS.
     */
    const options: Parameters<typeof mongoose.connect>[1] = {
      autoIndex: true,
     

      /**
       * DEV-ONLY FIX:
       * Some Windows machines break TLS chain with Atlas.
       * Allow connecting even if OS CA store is missing intermediate CA.
       */
      ...(isDev && {
        serverSelectionTimeoutMS: 5000,
        heartbeatFrequencyMS: 8000,
        family: 4,
      }),
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, options)
      .then((mongooseInstance) => mongooseInstance)
      .catch((err) => {
        console.error('❌ Failed MongoDB connection:', err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

/**
 * Connection state helper
 */
export function getConnectionState(): ConnectionStates {
  return mongoose.connection.readyState;
}
