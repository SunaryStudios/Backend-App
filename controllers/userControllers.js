const User = require('../database/Schema/Users');

exports.createUser = async (req, res) => {
    try {
        const user1 = await User.findOne({ key: '03092023Sharoll' });
        const user2 = await User.findOne({ key: '03092023Jesus' });

        if (!user1) {
            const newUser1 = new User({
                key: '03092023Sharoll',
                name: 'Sharoll',
                notes: [],
                news: [],
                events: []
            });
            await newUser1.save();

            res.status(201).json({ message: 'Usuario Sharoll creado exitosamente', user: newUser1 });
        } else {
            res.status(400).json({ message: 'El usuario Sharoll ya existe' });
        }

        if (!user2) {
            const newUser2 = new User({
                key: '03092023Jesus',
                name: 'Jesus',
                notes: [],
                news: [],
                events: []
            });
            await newUser2.save();

            res.status(201).json({ message: 'Usuario Jesus creado exitosamente', user: newUser2 });
        } else {
            res.status(400).json({ message: 'El usuario Jesus ya existe' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};

exports.getUser = async (req, res) => {
    try {
        const { key } = req.body;

        const user = await User.findOne({ key }).exec();

        if (user) {
            res.status(200).json(user.toObject());
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};