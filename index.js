import express from "express";
/* dotenv */
import bcrypt from "bcrypt";
import cors from 'cors';
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const db_client = new MongoClient(process.env.MONDODB_URL);
const db = db_client.db("learningpwa");
const dbCollection = db.collection("users");
/* start mongo */
const startMongo = async () => {
    try {
        await db_client.connect();
        console.log("MongoDB connected");
    } catch (error) {
        console.log(error);
    }
};

app.get("/", (req, res) => {
    res.json({ message: "Hello World" });
});

app.post("/server/login", (req, res) => {
    /* get password and use bcrypt to hash it */
    const { email, password } = req.body;
    console.log(email, password);
    /* get password from db with this email */
    dbCollection.findOne({ email: email }).then((user) => {
        console.log(user);
        if (user) {
            /* compare password */
            console.log('insdei ifelse');
            bcrypt.compare(password, user.password).then((result) => {
                if (result) {
                    console.log(result);
                    const { password, ...userWithoutPassword } = user;
                    res.json({
                        ...userWithoutPassword,
                        status: true,
                    });
                } else {
                    res.json(
                        {
                            status: false,
                            message: "Wrong password OR email",
                        }
                    );
                }
            });
        } else {
            res.json({ message: "Login No User Found" });
        }
    });
}
);
app.post("/server/register", (req, res) => {
    /* get pass and encryp it and send to mongodb */
    const { email, password } = req.body;
    console.log(req.body);

    const encryptedPassword = password;
    /* encrypt pass and send to mongodb */
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
            // Store hash in your password DB.
            console.log(hash);
            dbCollection.insertOne({
                ...req.body,
                email: email.toLowerCase(),
                password: hash,
            });
        });
    });
    res.json({ message: "Account created" });

}
);
const PORT = process.env.PORT || 5000;
/* liste and connec to mondodb */
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    startMongo();
}
);

/* post register */
