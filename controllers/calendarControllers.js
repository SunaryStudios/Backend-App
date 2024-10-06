const User = require("../database/Schema/Users");

exports.dayProblemCreate = async (req, res) => {
    try {
        const { day } = req.body;

        if (!day) {
            return res.status(400).json({ message: 'Datos del día no proporcionados' });
        }

        const newEvent = {
            day: day.day,
            month: day.month,
            year: day.year,
            response: day.response
        };
        
        const user = await User.findOneAndUpdate(
            { key: day.user, "events.day": day.day, "events.month": day.month, "events.year": day.year },
            { $set: { "events.$": newEvent } },
            { new: true, upsert: true } 
        );

        if (user) {
            return res.status(200).json({ message: 'Evento guardado exitosamente', day: newEvent });
        } else {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};


exports.dayRequest = async (req, res) => {
    try {
        const users = await User.find();

        const allEvents = users.flatMap(user => user.events);

        res.status(200).json(allEvents);
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};
