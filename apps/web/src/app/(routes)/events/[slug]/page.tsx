import { notFound } from "next/navigation";
import Image from "next/image";
import { EventAttributes } from "@/database/event.model";

const base_url = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const EventDetailItem = ({icon, alt, label}: { icon: string, alt: string, label: string}) => (
    <div className="flex-row-gap-2 items-center">
        <Image src={icon} alt={alt} width={17} height={17} />
        <p>{label}</p>
        </div>
)

const EventDetails = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;

    const response = await fetch(`${base_url}/api/events/${slug}`, { cache: 'no-store' });

    if (!response.ok) {
        return notFound();
    }

    const { event: {title, description, venue, agenda, time, image, overview, date, tags } } = await response.json() as { event: EventAttributes };

    if (!title) {
        return notFound();
    }

    return (
        <section id="event">
            <div className="header">
                <h1>{title}</h1>
                <p className="mt-2">{description}</p>
            </div>

            <div className="details">
                {/* left side */}
                <div className="content">
                    <Image src={image} alt="EventBanner" width={800} height={800} className="banner" />

                    <section className="flex-col-gap-2">
                        <h2>Overview</h2>
                        <p>{overview}</p>
                        </section>

                        <section className="flex-col-gap-2">
                            <h2>Event Details</h2>

                            <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={date} />
                            <EventDetailItem icon="/icons/clock.svg" alt="cock" label={time} />
                            <EventDetailItem icon="/icons/pin.svg" alt="pin" label={venue} />
                            </section> 
                </div>

                {/* right side  */}

                <aside className="booking">
                    <p className="text-lg font-semibold">Book Events</p>
                </aside>
            </div>


        </section>
    )
}
export default EventDetails