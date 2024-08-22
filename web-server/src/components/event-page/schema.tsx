import TypeOfSchemaParams from "./types/schemaType"

const Schema = ({title,description,startDate, endDate, placeName, image, ticketPrice, performer, isGroup}:TypeOfSchemaParams)=>{
    return (
        <script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            "name": title,
            "description": description,
            "startDate": startDate,
            "endDate": endDate,
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "location": {
              "@type": "Place",
              "name": placeName,
            },
            "image": [
              image
            ],
            "offers": {
              "@type": "Offer",
              "url": "https://example.com/tickets",
              "price": ticketPrice,
              "priceCurrency": "HUF",
              "availability": "https://schema.org/InStock",
            },
            "performer": {
              "@type": isGroup ? "Group" : "Person",
              "name": performer,
            }
          })}
          </script>
    )
}

export default Schema;