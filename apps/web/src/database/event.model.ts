import { Schema, model, models, Document, Model } from 'mongoose';

/**
 * Public shape of an Event document.
 */
export interface EventAttributes {
  title: string;
  slug: string;
  description: string;
  overview: string;
  price: string;
  image: string;
  venue: string;
  date: string; // normalized date string (YYYY-MM-DD)
  time: string; // normalized time string (HH:mm)
  agenda: string[];
  organizer: string;
  coordinator: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EventDocument extends EventAttributes, Document {}

export interface EventModel extends Model<EventDocument> {}

/**
 * Helper to ensure non-empty trimmed strings.
 */
const requiredString = {
  type: String,
  required: true as const,
  trim: true,
  validate: {
    validator(value: string): boolean {
      return value.trim().length > 0;
    },
    message: 'Field cannot be empty',
  },
};

const eventSchema = new Schema<EventDocument, EventModel>(
  {
    title: requiredString,
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: requiredString,
    overview: requiredString,
    price: requiredString,
    image: requiredString,
    venue: requiredString,
    date: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator(value: string[]): boolean {
          return Array.isArray(value) && value.length > 0 && value.every((item) => item.trim().length > 0);
        },
        message: 'Agenda must contain at least one non-empty item',
      },
    },
    organizer: requiredString,
    coordinator: requiredString,
    tags: {
      type: [String],
      required: true,
      validate: {
        validator(value: string[]): boolean {
          return Array.isArray(value) && value.length > 0 && value.every((item) => item.trim().length > 0);
        },
        message: 'Tags must contain at least one non-empty item',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Unique index on slug for fast lookups and to enforce uniqueness.
eventSchema.index({ slug: 1 }, { unique: true });

/**
 * Generate a URL-friendly slug from the title.
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Normalize a date string to ISO date format (YYYY-MM-DD).
 */
function normalizeDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }
  return date?.toISOString().split('T')[0];
}

/**
 * Normalize a time string to 24h HH:mm format.
 */
function normalizeTime(timeStr: string): string {
  const trimmed = timeStr.trim();
  // Accept common time formats like HH:mm or HH:mm:ss and normalize to HH:mm.
  const match = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!match) {
    throw new Error('Invalid time format; expected HH:mm');
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error('Invalid time value');
  }

  const normalizedHours = hours.toString().padStart(2, '0');
  const normalizedMinutes = minutes.toString().padStart(2, '0');

  return `${normalizedHours}:${normalizedMinutes}`;
}

/**
 * Pre-save hook to:
 * - ensure required string fields are non-empty
 * - generate / update slug when title changes
 * - normalize date and time formats
 */
eventSchema.pre<EventDocument>('save', function preSave(next) {
  try {
    // Validate required string fields are non-empty after trimming.
    const requiredFields: Array<
      'title' | 'description' | 'overview' | 'price' | 'image' | 'venue' | 'date' | 'time' | 'organizer' | 'coordinator'
    > = [
      'title',
      'description',
      'overview',
      'price',
      'image',
      'venue',
      'date',
      'time',
      'organizer',
      'coordinator',
    ];

    for (const field of requiredFields) {
      const value = this[field] as unknown;
      if (typeof value !== 'string' || value.trim().length === 0) {
        throw new Error(`Field "${field}" is required`);
      }
    }

    // Generate slug only when title is new or has been modified.
    if (this.isNew || this.isModified('title')) {
      this.slug = generateSlug(this.title!);
    }

    // Normalize date and time to consistent formats.
    this.date = normalizeDate(this.date!);
    this.time = normalizeTime(this.time!);

    next();
  } catch (error) {
    next(error as Error);
  }
});

export const Event: EventModel =
  (models.Event as EventModel | undefined) || model<EventDocument, EventModel>('Event', eventSchema);
