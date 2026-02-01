import Image from "next/image";
import Link from "next/link";
import { IndianRupee } from 'lucide-react'
import { EventAttributes } from "@/database/event.model";

// interface EventCardProps {
//     title: string;
//     image: string;
//     slug?: string;
//     date: Date;
//     time: Date;
//     venue: string;
//     coordinator: string;
//     price: number;
//     description: string;
// }

const EventCard = ({ event }: { event: EventAttributes }) => {
    return (
        <>
            <div>
                <Link href={event.slug ? `/events/${event.slug}` : '#'} id="event-card">
                    <Image src={event.image} alt={event.title} width={410} height={300} className="poster" />
                    <div className="flex justify-between">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row gap-2">
                                <Image src='/icons/pin.svg' alt={event.title} width={14} height={14} />
                                <p>{event.venue}</p>
                            </div>

                            <div>
                                <div className="title">{event.title}</div>
                                <p className="description">{event.description}</p>
                            </div>

                            <div className="datetime">
                                <div>
                                    <Image src='/icons/calendar.svg' alt={event.title} width={14} height={14} />
                                    <p>{event.date}</p>
                                </div>
                                <div>
                                    <Image src='/icons/clock.svg' alt={event.title} width={14} height={14} />
                                    <p>{event.time}</p>
                                </div>
                            </div>

                            <div>
                                Cordinator: {event.coordinator}
                            </div>
                        </div>

                        <div>
                            <div className="flex flex-row">
                                <IndianRupee />
                                <p className="text-xl">{event.price}</p>
                            </div>
                        </div>
                    </div>
                </Link>
            </div >
        </>
    );
}
export default EventCard;