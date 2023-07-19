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
                        startDate: event.date,
                        url: `http://localhost:3000/rendezveny/${event.id}`,
                        location : "Agora"
                    }
                    }
                })
            ]
            })}
        </script>
    )
}

export default GoogleSchemaEvents;