const { Router } = require("express");
const eventRouter = Router();

function getHypeTier(demandScore, daysUntilEvent) {
    if (demandScore > 0.75 && daysUntilEvent < 14) {
        return { hypeScore: "High demand", hypeClass: "hype-hot" };
    } 
    if (demandScore > 0.75) {
        return { hypeScore: "Hot event", hypeClass: "hype-hot" };
    } 
    if (demandScore > 0.60 && daysUntilEvent < 14) {
        return { hypeScore:"Selling fast. Don't wait!", hypeClass: "hype-warm"};
    } 
    if (demandScore > 0.60) {
        return { hypeScore:"Popular", hypeClass: "hype-warm" }
    } 
    if (daysUntilEvent > 180) {
        return { hypeScore:"Early listing. Prices likely to drop", hypeClass: "hype-cool" };
    } 
    return { hypeScore:"Moderate interest", hypeClass: "hype-neutral" };
    
}

eventRouter.get("/", async (req, res) => {
   try {
        const { q } = req.query;  // e.g. /api/events?q=lakers
        const performerUrl = `https://api.seatgeek.com/2/events?q=${ q }&client_id=${ process.env.CLIENT_ID }`;
        const performerResponse = await fetch(performerUrl);
        const performerData = await performerResponse.json();
        if (!performerData.events || performerData.events.length === 0) {
            return res.status(404).json({ message: "No event found" });
        }
        const result = performerData.events.map(event => {
            const demandScore = event.popularity ?? 0;
            const daysUntilEvent = Math.floor(
                (new Date(event.datetime_local) - new Date()) / (1000 * 60 * 60 * 24)
            );
            const { hypeScore, hypeClass } = getHypeTier(demandScore, daysUntilEvent);
            return {
                title: event.title,
                date: event.datetime_local,
                venue: event.venue.name,
                city: event.venue.city,
                state: event.venue.state,
                popularity: (demandScore * 100).toFixed(0),
                daysUntil: daysUntilEvent,
                hypeScore,
                hypeClass
            };
        });
        return res.status(200).json({ result });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
});

module.exports = eventRouter;