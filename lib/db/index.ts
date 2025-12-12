import mongoose, { Mongoose } from "mongoose";

/**
 * Extend the global namespace to store a singleton cache for the
 * MongoDB connection. This ensures that the connection is reused
 * during development (especially with Next.js hot reload).
 */
declare global {
  // eslint-disable-next-line no-var
  var __mongooseCache:
    | {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
      }
    | undefined;
}

/**
 * Initialize the cache if it does not already exist.
 */
const globalCache = global.__mongooseCache ?? {
  conn: null as Mongoose | null,
  promise: null as Promise<Mongoose> | null,
};

global.__mongooseCache = globalCache;

/**
 * Creates or retrieves the existing MongoDB connection.
 *
 * @param uri Optional MongoDB URI. If not provided, the function will
 *            read `process.env.MONGODB_URI`. Throws an error if it is missing.
 *
 * @returns A connected Mongoose instance.
 */
export async function connectToDatabase(uri?: string): Promise<Mongoose> {
  // Return existing connection if already established
  if (globalCache.conn) return globalCache.conn;

  const mongoUri = uri ?? process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI environment variable is missing.");
  }

  // If no existing promise, create one
  if (!globalCache.promise) {
    globalCache.promise = mongoose
      .connect(mongoUri, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      })
      .then((mongooseInstance) => mongooseInstance)
      .catch((err) => {
        // Reset cache on failure
        globalCache.promise = null;
        throw err;
      });
  }

  // Await the connect attempt
  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
}

/**
 * Checks if Mongoose is currently connected.
 *
 * @returns `true` if readyState === 1; otherwise `false`.
 */
export function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
