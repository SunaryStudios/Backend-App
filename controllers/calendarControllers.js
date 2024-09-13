const User = require("../database/Schema/Users");

exports.dayProblemCreate = async (req, res) => {
    try {
        const { day } = req.body;

        if (!day) {
            return res.status(400).json({ message: 'Datos del día no proporcionados' });
        }

        // Encontrar todos los usuarios que tengan el evento en la misma fecha
        const usersWithEvent = await Userz.find({ 
            "events.day": day.day, 
            "events.month": day.month, 
            "events.year": day.year 
        }).exec();

        const newEvent = {
            day: day.day,
            month: day.month,
            year: day.year,
            response: day.response
        };

        if (usersWithEvent.length > 0) {
            // Si existen usuarios con el mismo evento, actualizamos el evento
            for (const user of usersWithEvent) {
                const existingEventIndex = user.events.findIndex(event =>
                    event.day === day.day &&
                    event.month === day.month &&
                    event.year === day.year
                );

                if (existingEventIndex !== -1) {
                    user.events[existingEventIndex] = newEvent;
                }

                await user.save(); // Guardar los cambios
            }
        } else {
            // Si no existe el evento en ningún usuario, buscar el usuario por clave y agregar el nuevo evento
            const user = await User.findOne({ key: day.user }).exec();

            if (user) {
                user.events.push(newEvent);
                await user.save();
            } else {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
        }

        res.status(200).json({ message: 'Evento guardado exitosamente', day: newEvent });

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
