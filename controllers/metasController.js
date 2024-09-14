const User = require("../database/Schema/Users");

exports.createGoal = async (req, res) => {
    try {
        const { Meta } = req.body;

        if (!Meta) {
            return res.status(400).json({ message: 'Datos de la meta no proporcionados' });
        }

        const user = await User.findOne({ key: Meta.key }).exec();

        if (user) {
            const newGoal = {
                title: Meta.metaTitle,
                content: Meta.metaText,
                completed: false,
                timestamp: new Date(),
            };

            user.Goals.push(newGoal);

            await user.save();

            res.status(200).json({ message: 'Meta guardada exitosamente', note: newGoal });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};

exports.goalsRequest = async (req, res) => {
    try {
        const allGoals = await User.find({}, { 'Goals': 1, 'name': 1, 'avatar': 1 });

        if (!allGoals.length) {
            return res.status(404).json({ message: 'No se encontraron notas' });
        }

        const goalsWithAuthor = [];

        for (const user of allGoals) {
            let userUpdated = false; 

            if (user.Goals && user.Goals.length) {
                for (const goals of user.Goals) {
                    if (!goals.timestamp) {
                        goals.timestamp = new Date();
                        userUpdated = true;
                    }
                    goalsWithAuthor.push({
                        author: user.name,
                        avatar: user.avatar || '',
                        title: goals.title,
                        content: goals.content,
                        completed: goals.completed,
                        timestamp: goals.timestamp,
                    });
                }

                if (userUpdated) {
                    await user.save();
                }
            }
        }

        // Ordenar las notas por timestamp de la más reciente a la más antigua
        goalsWithAuthor.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        res.status(200).json(goalsWithAuthor);

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};
