const User = require("../database/Schema/Users");

exports.createGoal = async (req, res) => {
    try {
        const { MetaData } = req.body;

        if (!MetaData) {
            return res.status(400).json({ message: 'Datos de la meta no proporcionados' });
        }

        const user = await User.findOne({ key: MetaData.key }).exec();

        if (user) {
            const newGoal = {
                content: MetaData.metaText,
                timestamp: new Date(),
            };

            user.Goals.push(newGoal);

            await user.save();

            res.status(200).json({ message: 'Meta guardada exitosamente', note: newNote });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};

exports.noteRequest = async (req, res) => {
    try {
        const allNotes = await User.find({}, { 'notes': 1, 'name': 1, 'avatar': 1 });

        if (!allNotes.length) {
            return res.status(404).json({ message: 'No se encontraron notas' });
        }

        const notesWithAuthor = [];

        for (const user of allNotes) {
            let userUpdated = false; 

            if (user.notes && user.notes.length) {
                for (const note of user.notes) {
                    if (!note.timestamp) {
                        note.timestamp = new Date();
                        userUpdated = true;
                    }
                    notesWithAuthor.push({
                        author: user.name,
                        avatar: user.avatar || '',
                        content: note.content,
                        emotion: note.emotion,
                        color: note.color,
                        timestamp: note.timestamp,
                    });
                }

                if (userUpdated) {
                    await user.save();
                }
            }
        }

        // Ordenar las notas por timestamp de la más reciente a la más antigua
        notesWithAuthor.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        res.status(200).json(notesWithAuthor);

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};
