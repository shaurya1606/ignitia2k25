
import ExploreButton from "./_components/ExploreButton"
import EventCard from "./_components/EventCard"
import { EventAttributes } from "@/database/event.model"

// const events = [
//     {image: '/images/event1.png', title: 'Event One', venue: 'Venue One', date: new Date(), time: new Date(), description: 'Description One', price: 10, coordinator: 'Coordinator One', slug: 'event-one'},
//     {image: '/images/event2.png', title: 'Event Two', venue: 'Venue Two', date: new Date(), time: new Date(), description: 'Description Two', price: 20, coordinator: 'Coordinator Two', slug: 'event-two'},
//     {image: '/images/event3.png', title: 'Event Three', venue: 'Venue Three', date: new Date(), time: new Date(), description: 'Description Three', price: 30, coordinator: 'Coordinator Three', slug: 'event-three'},
//     {image: '/images/event4.png', title: 'Event Four', venue: 'Venue Four', date: new Date(), time: new Date(), description: 'Description Four', price: 40, coordinator: 'Coordinator Four', slug: 'event-four'},
//     {image: '/images/event5.png', title: 'Event Five', venue: 'Venue Five', date: new Date(), time: new Date(), description: 'Description Five', price: 50, coordinator: 'Coordinator Five', slug: 'event-five'},
//     {image: '/images/event6.png', title: 'Event Six', venue: 'Venue Six', date: new Date(), time: new Date(), description: 'Description Six', price: 60, coordinator: 'Coordinator Six', slug: 'event-six'},
// ]
const configuredBaseUrl = (() => {
    const value = process.env.NEXT_PUBLIC_BASE_URL;
    if (!value) return "";
    return value.replace(/\/$/, "");
})();

function buildApiUrl(path: string) {
    if (!configuredBaseUrl) return path;
    return `${configuredBaseUrl}${path}`;
}

const Events = async() => {

    let events: EventAttributes[] = [];

    try {
        const endpoint = buildApiUrl('/api/events');
        const response = await fetch(endpoint, { cache: 'no-store' });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Events API responded with ${response.status}: ${errorBody}`);
        }

        const contentType = response.headers.get('content-type') ?? '';
        if (!contentType.includes('application/json')) {
            const preview = await response.text();
            throw new Error(`Expected JSON but received: ${preview.slice(0, 120)}`);
        }

        const payload = (await response.json()) as { events?: EventAttributes[] };
        events = payload.events ?? [];
    } catch (error) {
        console.error('Failed to load events list:', error);
    }

    return (
        <div>
            <div className="space-y-4 text-center">
                <h1>EXPLORE EVENTS</h1>
                <p>Explore and register for exciting line-up of technical and cultural events.</p>
                <ExploreButton />
            </div>

            <div className="mt-20 space-y-6">
                {/* Event categories and listings will go here */}
                <h3>Featured Events</h3>
                <ul className="events list-none space-y-4">
                    {events && events.length > 0 && events.map((event: EventAttributes, index: number) => (
                        <EventCard key={event?.slug ?? `event-${index}`} event={event} />
                    ))}
                </ul>
                
            </div>
        </div>
    )
}

export default Events