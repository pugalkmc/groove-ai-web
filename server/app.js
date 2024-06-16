import express from "express";
import morgan from "morgan";
import cors from "cors";
import { PORT } from "./config.js";
import mongodbConnect from "./database/db.js";
import Project from "./database/models/project.js";
import User from "./database/models/user.js";
import Registration from "./database/models/registration.js";
import Plan from "./database/models/plan.js";
import { authMiddleware, attachUserToRequest, errorHandler } from "./public/middleware/auth.js";
import { login, register } from "./public/middleware/authenticator.js";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const app = express();

mongodbConnect();
app.use(express.json());
app.use(morgan());
app.use(cors());

// Register endpoint
app.post('/api/register', register);
app.post('/api/login', login);

app.use(authMiddleware);
app.use(attachUserToRequest);
app.use(errorHandler);

app.post('/api/auth', (req, res)=> {
    return res.status(200).json({message: 'Json web token is valid'})
})

app.get("/healthcheck", (req, res)=> {
    return res.json({ status:"success" });
});


app.get("/api/profile", async (req, res) => {
    const { _id } = req.user;
    await User.findById({ _id: new mongoose.Types.ObjectId(_id) }, { name: 1, email: 1, _id: 0})
    .then( response => {
        if (response){
            return res.status(200).json(response);
        }
        return res.sendStatus(401);
    })
    .catch(err => {
        console.log(err);
        return res.sendStatus(500);
    })
})


app.post("/api/profile", async (req, res) => {
    const { _id } = req.user;
    const { name, email } = req.body;
    await User.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(_id) }, { $set : { name, email }})
    .then( response => {
        return res.sendStatus(200);
    })
    .catch(err => {
        console.log(err);
        return res.sendStatus(500);
    })
})


app.get("/api/project/details", async (req, res) => {
    const { _id } = req.user;
    // console.log(req.user)
    const response = await Project.findOne({ manager: new mongoose.Types.ObjectId(_id) }, {name: 1, email: 1, source: 1, _id: 0});
    // console.log(response)
    return res.json(response);
})

app.post("/api/project/details", async (req, res) => {
    const { _id } = req.user;
    const { name, email } = req.body;
    await Project.findOneAndUpdate({ manager: new mongoose.Types.ObjectId(_id) }, { $set : { name, email }})
    .then( response => {
        return res.sendStatus(200);
    })
    .catch(err => {
        console.log(err);
        return res.sendStatus(500);
    })
})




app.get('/api/project/controls', async (req, res) => {
    const { _id } = req.user;
    await Project.findOne({ manager: new mongoose.Types.ObjectId(_id) }, {controls: 1, _id: 0})
    .then( response => {
        return res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        return res.sendStatus(500);
    })
})


app.post('/api/project/controls', async (req, res) => {
    const { _id } = req.user;
    await Project.findOneAndUpdate({ manager: new mongoose.Types.ObjectId(_id) }, { $set : { controls: req.body }})
    .then( response => {
        return res.sendStatus(200);
    })
    .catch(err => {
        console.log(err);
        return res.sendStatus(500);
    })
})


app.post("/api/project/source/link", authMiddleware, async (req, res) => {
    const { _id } = req.user;
    const { tag } = req.body;

    try {
        await Project.findOneAndUpdate(
            { manager: new mongoose.Types.ObjectId(_id) },
            { $push: { 'source.link': { id: uuidv4(), tag, isUpdated: false, addedAt: new Date() } } }
        );
        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
});

app.delete("/api/project/source/link/:id", authMiddleware, async (req, res) => {
    const { _id } = req.user;
    const { id } = req.params;

    try {
        await Project.findOneAndUpdate(
            { manager: new mongoose.Types.ObjectId(_id) },
            { $pull: { 'source.link': { id } } }
        );
        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
});

app.post("/api/project/source/text", authMiddleware, async (req, res) => {
    const { _id } = req.user;
    const { tag, value } = req.body;

    try {
        await Project.findOneAndUpdate(
            { manager: new mongoose.Types.ObjectId(_id) },
            { $push: { 'source.text': { id: uuidv4(), tag, value, isUpdated: false, addedAt: new Date() } } }
        );
        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
});

app.delete("/api/project/source/text/:id", authMiddleware, async (req, res) => {
    const { _id } = req.user;
    const { id } = req.params;

    try {
        await Project.findOneAndUpdate(
            { manager: new mongoose.Types.ObjectId(_id) },
            { $pull: { 'source.text': { id } } }
        );
        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
});

app.put("/api/project/source/text/:id", authMiddleware, async (req, res) => {
    const { _id } = req.user;
    const { id } = req.params;
    const { value } = req.body;

    try {
        await Project.findOneAndUpdate(
            { manager: new mongoose.Types.ObjectId(_id), 'source.text.id': id },
            { $set: { 'source.text.$.value': value, 'source.text.$.isUpdated': true, 'source.text.$.updatedAt': new Date() } }
        );
        return res.sendStatus(200);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
});

  


app.post('/projects', async (req, res) => {
    try {
        const { name, email, source, manager } = req.body;
        const project = new Project({ name, email, source, manager });
        await project.save();
        return res.status(201).json(project);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Server Error');
    }
});

// User Routes
app.post('/users', async (req, res) => {
    try {
        const { name, email, password, payments } = req.body;
        const user = new User({ name, email, password, payments });
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Registration Routes
app.post('/registrations', async (req, res) => {
    try {
        const { email, verificationId } = req.body;
        const registration = new Registration({ email, verificationId });
        await registration.save();
        res.status(201).json(registration);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Source Routes
app.post('/sources', async (req, res) => {
    try {
        const { type, content } = req.body;
        const source = new Source({ type, content });
        await source.save();
        res.status(201).json(source);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Plan Routes
app.post('/plans', async (req, res) => {
    try {
        const { name, price } = req.body;
        const plan = new Plan({ name, price });
        await plan.save();
        res.status(201).json(plan);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// Plan Routes
// app.post('/controls', async (req, res) => {
//     try {
//         const { name, price } = req.body;
//         const plan = new Project({ name, price });
//         await plan.save();
//         res.status(201).json(plan);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

app.use(errorHandler);

app.listen(PORT, ()=> {
    console.log(`Server started, Listening to PORT: ${PORT}`);
});
