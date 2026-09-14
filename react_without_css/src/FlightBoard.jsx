function FlightBoard() {
    const flights = [
            { number: "6E 204", to: "Delhi",     time: "06:15", gate: "A3",  status: "On Time" },
            { number: "AI 502", to: "Mumbai",    time: "07:00", gate: "B1",  status: "Delayed" },
            { number: "UK 811", to: "Hyderabad", time: "07:45", gate: "A7",  status: "Boarding" },
            { number: "SG 132", to: "Chennai",   time: "08:20", gate: "C2",  status: "On Time" },
            { number: "6E 998", to: "Kolkata",   time: "09:05", gate: "B4",  status: "Cancelled" },
        ]
    return (
        <table border="1">
            <caption>{flights.length} departures</caption>
            <thead>
                <th>Flight</th>
                <th>To</th>
                <th>Time</th>
                <th>Gate</th>
                <th>Status</th>
            </thead>
            <tbody>
                {
                    flights.map((flight) => (
                        <tr key={flight.number}>
                            <td>{flight.number}</td>
                            <td>{flight.to}</td>
                            <td>{flight.time}</td>
                            <td>{flight.gate}</td>
                            <td>{flight.status}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}

export default FlightBoard