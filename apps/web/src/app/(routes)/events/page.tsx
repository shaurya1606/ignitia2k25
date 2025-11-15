
import ExploreButton from "./_components/ExploreButton"
import EventCard from "./_components/EventCard"

const events = [
    {image: '/images/event1.png', title: 'Event One', venue: 'Venue One', date: new Date(), time: new Date(), description: 'Description One', price: 10, coordinator: 'Coordinator One', slug: 'event-one'},
    {image: '/images/event2.png', title: 'Event Two', venue: 'Venue Two', date: new Date(), time: new Date(), description: 'Description Two', price: 20, coordinator: 'Coordinator Two', slug: 'event-two'},
    {image: '/images/event3.png', title: 'Event Three', venue: 'Venue Three', date: new Date(), time: new Date(), description: 'Description Three', price: 30, coordinator: 'Coordinator Three', slug: 'event-three'},
    {image: '/images/event4.png', title: 'Event Four', venue: 'Venue Four', date: new Date(), time: new Date(), description: 'Description Four', price: 40, coordinator: 'Coordinator Four', slug: 'event-four'},
    {image: '/images/event5.png', title: 'Event Five', venue: 'Venue Five', date: new Date(), time: new Date(), description: 'Description Five', price: 50, coordinator: 'Coordinator Five', slug: 'event-five'},
    {image: '/images/event6.png', title: 'Event Six', venue: 'Venue Six', date: new Date(), time: new Date(), description: 'Description Six', price: 60, coordinator: 'Coordinator Six', slug: 'event-six'},
]

const Events = () => {
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
                    {events.map((event) => (
                        <EventCard key={event.title} title={event.title} image={event.image} venue={event.venue} date={event.date} time={event.time} description={event.description} price={event.price} coordinator={event.coordinator} slug={event.slug} />
                    ))}
                </ul>
                
            </div>
        </div>
    )
}

export default Events