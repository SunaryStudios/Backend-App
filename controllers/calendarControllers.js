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

        // Buscar el usuario por clave
        const user = await User.findOne({ key: day.user });

        if (user) {
            // Buscar si ya existe un evento con el mismo día, mes y año
            const existingEventIndex = user.events.findIndex(event =>
                event.day === day.day &&
                event.month === day.month &&
                event.year === day.year
            );

            if (existingEventIndex !== -1) {
                // Si existe, actualiza el evento
                user.events[existingEventIndex] = newEvent;
            } else {
                // Si no existe, agrega el nuevo evento
                user.events.push(newEvent);
            }

            // Guardar los cambios en el usuario
            await user.save();

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
