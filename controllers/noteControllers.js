const User = require("../database/Schema/Users");

exports.createNote = async (req, res) => {
    try {
        const { note } = req.body;

        if (!note) {
            return res.status(400).json({ message: 'Datos de la nota no proporcionados' });
        }

        const user = await User.findOne({ key: note.key }).exec();

        if (user) {
            const newNote = {
                content: note.content,
                emotion: note.emotion,
                color: note.color,
            };

            user.notes.push(newNote);

            await user.save();

            res.status(200).json({ message: 'Nota guardada exitosamente', note: newNote });
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
        // Fetch all users with notes and names, also include avatar if it exists
        const allNotes = await User.find({}, { 'notes': 1, 'name': 1, 'avatar': 1 });

        if (!allNotes.length) {
            return res.status(404).json({ message: 'No se encontraron notas' });
        }

        const notesWithAuthor = [];

        for (const user of allNotes) {
            if (user.notes && user.notes.length) {
                for (const note of user.notes) {
                    notesWithAuthor.push({
                        author: user.name, 
                        avatar: user.avatar || '', // Ensure avatar is included
                        content: note.content,
                        emotion: note.emotion,
                        color: note.color,
                    });
                }
            }
        }

        res.status(200).json(notesWithAuthor);

    } catch (error) {
        console.error("Server Error:", error); // Improved error logging
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};