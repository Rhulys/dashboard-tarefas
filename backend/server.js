require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ApolloServer, gql } = require("apollo-server-express");
const mongoose = require("mongoose");
const Task = require("./models/Task");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const { predictTime } = require("./mlModel");

const app = express();
app.use(cors());
app.use(express.json());

const typeDefs = gql`
    type User {
        id: ID!
        name: String!
        email: String!
        token: String
    }

    type Task {
        id: ID!
        text: String!
        completed: Boolean!
        estimatedTime: String
    }

    type Query {
        tasks: [Task]
    }

    type Mutation {
        register(name: String!, email: String!, password: String!): User
        login(email: String!, password: String!): User
        addTask(text: String!): Task
        removeTask(id: ID!): Boolean
        toggleTask(id: ID!): Task
        predictCompletionTime(id: ID!): String
    }
`;

const resolvers = {
    Query: {
        tasks: async (_, __, { userId }) => {
            if (!userId) {
                throw new Error("Não autorizado.");
            }
            return await Task.find({ user: userId });
        },
    },
    Mutation: {
        register: async (_, { name, email, password }) => {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error("E-mail já registrado");
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User({ name, email, password: hashedPassword });
            await newUser.save();

            const token = jwt.sign(
                {
                    userId: newUser.id,
                },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );
            return {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                token,
            };
        },
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error("Usuário não encontrado!");
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                throw new Error("Senha incorreta.");
            }

            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            return { id: user.id, name: user.name, email: user.email, token };
        },
        addTask: async (_, { text }, { userId }) => {
            if (!userId) {
                throw new Error("Não autorizado.");
            }

            const newTask = new Task({
                text,
                completed: false,
                estimatedTime: null,
                user: userId,
            });
            return await newTask.save();
        },
        removeTask: async (_, { id }) => {
            await Task.findByIdAndDelete(id);
            return true;
        },
        toggleTask: async (_, { id }) => {
            const task = await Task.findById(id);
            task.completed = !task.completed;
            return await task.save();
        },
        predictCompletionTime: async (_, { id }) => {
            const task = await Task.findById(id);

            if (!task) {
                throw new Error("Tarefa não encontrada!");
            }

            const predictedTime = await predictTime(task.text);

            task.estimatedTime = predictedTime;
            await task.save();

            return task.estimatedTime;
        },
    },
};

function predictCompletionTime(taskText) {
    const wordCount = taskText.split(" ").length;
    const estimatedDays = Math.min(Math.max(Math.ceil(wordCount / 2), 1), 7);
    return `${estimatedDays} dias`;
}

async function startServer() {
    try {
        console.log("🔄 Tentando conectar ao MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ Conectado ao MongoDB!");

        const server = new ApolloServer({
            typeDefs,
            resolvers,
            context: ({ req }) => {
                const token = req.headers.authorization || "";
                console.log("🔍 Token recebido:", token);

                try {
                    const decoded = jwt.verify(
                        token.replace("Bearer ", ""),
                        process.env.JWT_SECRET
                    );
                    console.log("✅ Token decodificado:", decoded);
                    return { userId: decoded.userId };
                } catch (err) {
                    console.error("❌ Erro ao validar token:", err.message);
                    return {};
                }
            },
        });

        await server.start();
        server.applyMiddleware({ app });

        app.listen(4000, () => {
            console.log(`Servidor rodando em http://localhost:4000/graphql`);
        });
    } catch (error) {
        concole.error("❌ Erro ao conectar ao MongoDB:", error);
        process.exit(1);
    }
}

startServer();
