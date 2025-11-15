import Image from "next/image";
import Link from "next/link";
import { IndianRupee } from 'lucide-react'

interface EventCardProps {
    title: string;
    image: string;
    slug?: string;
    date: Date;
    time: Date;
    venue: string;
    coordinator: string;
    price: number;
    description: string;
}

const EventCard = ({ title, image, date, time, venue, description, price, coordinator, slug }: EventCardProps) => {
    return (
        <>
            <div>
                <Link href={slug ? `/events/${slug}` : '#'} id="event-card">
                    <Image src={image} alt={title} width={410} height={300} className="poster" />
                    <div className="flex justify-between">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row gap-2">
                                <Image src='/icons/pin.svg' alt={title} width={14} height={14} />
                                <p>{venue}</p>
                            </div>

                            <div>
                                <div className="title">{title}</div>
                                <p className="description">{description}</p>
                            </div>

                            <div className="datetime">
                                <div>
                                    <Image src='/icons/calendar.svg' alt={title} width={14} height={14} />
                                    <p>{date.toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <Image src='/icons/clock.svg' alt={title} width={14} height={14} />
                                    <p>{time.toLocaleTimeString()}</p>
                                </div>
                            </div>

                            <div>
                                Cordinator: {coordinator}
                            </div>
                        </div>

                        <div>
                            <div className="flex flex-row">
                                <IndianRupee />
                                <p className="text-xl">{price}</p>
                            </div>
                        </div>
                    </div>
                </Link>
            </div >
        </>
    );
}
export default EventCard;