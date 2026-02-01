import { Schema, model, models, Document, Model } from 'mongoose';

/**
 * Public shape of an Event document.
 */
export interface EventAttributes {
  title: string;
  slug?: string;
  description: string;
  overview: string;
  price: string;
  image: string;
  venue: string;
  date: string;  // YYYY-MM-DD
  time: string;  // HH:mm
  agenda: string[];
  organizer: string;
  coordinator: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type EventDocument = EventAttributes & Document;
export type EventModel = Model<EventDocument>;

/**
 * Helper: simple required trimmed string
 */
const requiredString = {
  type: String,
  required: true,
  trim: true,
  minlength: 1,
};

const eventSchema = new Schema<EventDocument, EventModel>(
  {
    title: requiredString,

    slug: {
      type: String,
      unique: true,
      trim: true,
      index: true,
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
      validate(value: string[]) {
        return value.length > 0 && value.every((i) => i.trim().length > 0);
      },
    },

    organizer: requiredString,
    coordinator: requiredString,

    tags: {
      type: [String],
      required: true,
      validate(value: string[]) {
        return value.length > 0 && value.every((i) => i.trim().length > 0);
      },
    },
  },
  { timestamps: true }
);

/**
 * Generate basic slug
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Normalize a date string to ISO format (YYYY-MM-DD)
 */
function normalizeDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) throw new Error('Invalid date format');
  return date.toISOString().split('T')[0]!;
}

/**
 * Normalize to 24h time HH:mm
 */
function normalizeTime(timeStr: string): string {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!match) throw new Error('Invalid time format; expected HH:mm');

  const [, h, m] = match;
  const hour = Number(h);
  const min = Number(m);

  if (hour < 0 || hour > 23 || min < 0 || min > 59)
    throw new Error('Invalid time value');

  return `${hour.toString().padStart(2, '0')}:${min
    .toString()
    .padStart(2, '0')}`;
}

/**
 * Resolve slug conflicts:
 * If "tech-fest" exists → "tech-fest-2", "tech-fest-3"...
 */
async function resolveSlugConflict(
  model: EventModel,
  baseSlug: string
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (await model.exists({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Pre-validate hook:
 * - generate slug
 * - ensure slug uniqueness
 * - normalize date + time BEFORE validation
 * This is the CORRECT hook stage (NOT pre-save)
 */
eventSchema.pre<EventDocument>('validate', async function (next) {
  try {
    // normalize fields before validation
    this.date = normalizeDate(this.date);
    this.time = normalizeTime(this.time);

    // generate slug if missing or title changed
    if (this.isNew || this.isModified('title')) {
      const rawSlug = generateSlug(this.title);
      this.slug = await resolveSlugConflict(this.constructor as EventModel, rawSlug);
    }

    next();
  } catch (err) {
    next(err as Error);
  }
});

export const Event: EventModel =
  (models.Event as EventModel) ||
  model<EventDocument, EventModel>('Event', eventSchema);
