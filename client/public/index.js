const eventForm = document.getElementById("search-event-form");
const eventContainer = document.getElementById("event-container");
const statusMessage = document.getElementById("status-message");

eventForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Reset state.
    eventContainer.innerHTML = "";
    statusMessage.style.display = "none";
    statusMessage.className = "status-message";

    // Show skeleton loading
    eventContainer.innerHTML = Array(5).fill(createSkeletonCard()).join('');

    await getEventList();
});

function createSkeletonCard() {
    return `
        <div class="skeleton-event-card">
            <div class="skeleton-event-card-header">
                <h3 class="skeleton skeleton-event-display-title"></h3>
                <p class="skeleton skeleton-hype-score"></p>
            </div>
            <div class="skeleton-event-card-body">
                <div class="skeleton-event-info">
                    <div class="skeleton-info-column">
                        <p class="skeleton skeleton-date"></p>
                        <p class="skeleton skeleton-event-date"></p>
                    </div>
                    <div class="skeleton-info-column">
                        <p class="skeleton skeleton-venue"></p>
                        <p class="skeleton skeleton-event-venue"></p>
                    </div>
                    <div class="skeleton-info-column">
                        <p class="skeleton skeleton-location"></p>
                        <p class="skeleton skeleton-event-location"></p>
                    </div>
                </div>
                <div class="skeleton-breakline"></div>
            </div>
            <div class="skeleton-event-card-footer">
                <p class="skeleton skeleton-event-countdown"></p>
                <div class="skeleton-progress-container">
                    <div class="skeleton skeleton-demand-alert"></div>
                    <div class="skeleton skeleton-progress"></div>
                </div>
            </div>
        </div>
    `;
}

async function getEventList() {
    try {
        const result = await fetchEvents();
        eventContainer.innerHTML = "";

        const totalEvents = result.length;
        const resultMessage = createResultMessage();
        displayResultMessage(resultMessage, totalEvents);
        createEventCard(result, eventContainer);
        eventForm.reset();
    } catch (err) {
        eventContainer.innerHTML = "";
        statusMessage.style.display = "block";
        statusMessage.textContent = err.message;
        statusMessage.className = "status-message error";
    }
}

async function fetchEvents() {
    const query = document.getElementById("event-search").value.trim();
    const response = await fetch(`/api/events?q=${ encodeURIComponent(query) }`);
    if (response.status === 404) {
        throw new Error(`No events found for "${query}". Please check back at a later time.`);
    }
    if (!response.ok) { 
        throw new Error("Something went wrong. Please try again.");
    }
    const { result } = await response.json();
    return result;
}

function createResultMessage(eventTotal) {
    const resultMessage = document.createElement("div");
    resultMessage.className = "result-message";

    return resultMessage;
}

function displayResultMessage(resultMessage, totalEvents) {
    resultMessage.innerHTML = `
        <p class="total-events-message">Results <span class="total-events">${ totalEvents} events</span></p>
    `;

    eventContainer.appendChild(resultMessage);
}

function createEventCard(result, eventStructure) {
    result.forEach(event => {
        const eventCard = createEventCardContainer();
        const eventCardHeader = createEventCardHeader(event);
        eventCard.appendChild(eventCardHeader);
        const eventCardBody = createEventCardBody(event);
        appendEventComponenet(eventCard, eventCardBody);
        const eventCardFooter = createEventCardFooter(event);
        appendEventComponenet(eventCard, eventCardFooter);
        appendEventComponenet(eventStructure, eventCard);
        // eventStructure.appendChild(eventCard);
    });
}

function createEventCardContainer() {
    const eventCard = document.createElement("div");
    eventCard.className = "event-card";

    return eventCard;
}

function createEventCardHeader(event) {
    const eventCardHeader = document.createElement("div");
    eventCardHeader.className = "event-card-header";
    eventCardHeader.innerHTML = `
        <h3 class="event-display-title">${ escapeHTML(event.title) }</h3>
        <p class="hype-score ${ event.hypeClass }">${ escapeHTML(event.hypeScore) }</p>
    `;

    return eventCardHeader;
}

// Time and Date Information
function formatDateTime(datetimeLocal) {
    const [datePart, timePart] = datetimeLocal.split("T");
    const [year, month, day] = datePart.split("-");
    let [hour, minute] = timePart.split(":");
    const hr = parseInt(hour, 10);
    const suffix = hr >= 12 ? "pm" : "am";
    const hr12 = hr === 0 ? 12 : hr > 12 ? hr - 12 : hr;

    return `${ month }-${ day }-${ year } ${ hr12 }:${ minute }${ suffix }`;
}

function createEventCardBody(event) {
    const eventCardBody = document.createElement("div");
    eventCardBody.className = "event-card-body";
    eventCardBody.innerHTML = `
        <div class="event-info">
            <div class="info-column">
                <p class="date">Date</p>
                <p class="event-date">${ escapeHTML(formatDateTime(event.date)) }</p>
            </div>
            <div class="info-column">
                <p class="venue">Venue</p>
                <p class="event-venue">${ escapeHTML(event.venue) }</p>
            </div>
            <div class="info-column">
                <p class="location">Location</p>
                <p class="event-location">${ escapeHTML(event.city) }, ${ escapeHTML(event.state) } </p>
            </div>
        </div>
        <div class="breakline"></div>
    `;

    return eventCardBody;
}

function createEventCardFooter(event) {
    const eventCardFooter = document.createElement("div");
    eventCardFooter.className = "event-card-footer";
    eventCardFooter.innerHTML = `
        <p class="event-countdown">Days until event: <span class="number-of-days-left">${ event.daysUntil }</span></p>
        <div class="progress-container">
            <div class="demand-alert">Demand</div>
            <div class="progress">
                <div 
                    class="progress-bar" 
                    role="progressbar" 
                    style="width: ${ event.popularity }%;" 
                    aria-valuenow="${ event.popularity }" 
                    aria-valuemin="0" 
                    aria-valuemax="100">
                    ${ escapeHTML(event.popularity + "%") }
                </div>
            </div>
        </div>
    `

    return eventCardFooter;
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str ?? '';
    return div.innerHTML;
}

function appendEventComponenet(eventCard, eventType) {
    eventCard.appendChild(eventType);
}

// <p class="popularity popularity-bar">Demand ${ event.popularity }</p>
