import { Schema, model, models, Document, Model, Types } from 'mongoose';
import { Event } from './event.model';

export interface BookingAttributes {
  eventId: Types.ObjectId;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BookingDocument extends BookingAttributes, Document {}

export interface BookingModel extends Model<BookingDocument> {}

const bookingSchema = new Schema<BookingDocument, BookingModel>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator(value: string): boolean {
          // Simple but robust email pattern suitable for most use cases.
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: 'Invalid email address',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index on eventId to speed up lookups for bookings by event.
bookingSchema.index({ eventId: 1 });

/**
 * Pre-save hook to ensure:
 * - the referenced event exists
 * - the email is valid (extra guard in addition to schema-level validation)
 */
bookingSchema.pre<BookingDocument>('save', async function preSave(next) {
  try {
    // Ensure the referenced event exists before creating the booking.
    if (!this.eventId) {
      throw new Error('eventId is required');
    }

    const eventExists = await Event.exists({ _id: this.eventId });
    if (!eventExists) {
      throw new Error('Referenced event does not exist');
    }

    // Additional runtime email validation guard.
    if (typeof this.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      throw new Error('Invalid email address');
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

export const Booking: BookingModel =
  (models.Booking as BookingModel | undefined) || model<BookingDocument, BookingModel>('Booking', bookingSchema);
