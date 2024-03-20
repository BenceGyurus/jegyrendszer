type typeOfGoogleSchemaEvents = {
    events : any
};

const GoogleSchemaEvents = ({events}:typeOfGoogleSchemaEvents)=>{
    return (
        <script type="application/ld+json">
            {JSON.stringify({
            '@context': 'http://schema.org',
            Event : [
                events.map((event:any)=>{
                    if (event.title && event.date && event.id){
                    return {
                        '@type': 'Event',
                        name: event.title,
                        startDate: new Date(event.date),
                        url: `${window.location.origin}/rendezveny/${event.id}`,
                        place : event.location,
                        description : event.description,
                        endDate : new Date(event.end),
                        image :`${window.location.origin}${event.imageName}`,
                        location: {
                            "@type": "Place",
                            name: event.location,
                            address: {
                              "@type": "PostalAddress",
                              name : event.address
                            }
                        },
                        eventStatus: "https://schema.org/EventScheduled",
                        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
                        organizer: {
                            "@type": "Organization",
                            name: event.organiser.name,
                            url: event.organiser.website
                        },
                        offers : {
                            "@type": "Offer",
                            url: `${window.location.origin}/rendezveny/${event.id}`,
                            price: event.tickets.length ? event.tickets[0]?.price : 0,
                            priceCurrency: "HUF",
                            validFrom: "2024-05-21T12:00"
                        },
                        performer: {
                            "@type": event.performer.isGroupPerformer ? "PerformingGroup" : "Person",
                            name: event.performer.name
                          },
                    }
                    }
                })
            ]
            })}
        </script>
    )
}

export default GoogleSchemaEvents;