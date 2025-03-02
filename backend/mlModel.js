const tf = require("@tensorflow/tfjs-node");

const trainingData = [
    { textLength: 1, timeToComplete: 1 },
    { textLength: 5, timeToComplete: 1 },
    { textLength: 10, timeToComplete: 2 },
    { textLength: 15, timeToComplete: 3 },
    { textLength: 20, timeToComplete: 5 },
    { textLength: 30, timeToComplete: 7 },
    { textLength: 50, timeToComplete: 10 },
    { textLength: 70, timeToComplete: 15 },
    { textLength: 100, timeToComplete: 20 },
];

const maxTextLength = Math.max(...trainingData.map((d) => d.textLength));
const maxTimeToComplete = Math.max(
    ...trainingData.map((d) => d.timeToComplete)
);

const xs = tf.tensor2d(
    trainingData.map((d) => [d.textLength / maxTextLength]),
    [trainingData.length, 1]
);
const ys = tf.tensor2d(
    trainingData.map((d) => [d.timeToComplete / maxTimeToComplete]),
    [trainingData.length, 1]
);

const model = tf.sequential();
model.add(tf.layers.dense({ units: 16, activation: "relu", inputShape: [1] }));
model.add(tf.layers.dense({ units: 16, activation: "relu" }));
model.add(tf.layers.dense({ units: 1, activation: "linear" }));
model.compile({ loss: "meanSquaredError", optimizer: tf.train.adam(0.01) });

async function trainModel() {
    if (!global.isModelTrained) {
        console.log("Treinando modelo...");
        await model.fit(xs, ys, { epochs: 2000 });
        console.log("🎯 Modelo treinado!");
        global.isModelTrained = true;
    }
}

async function predictTime(text) {
    await trainModel();

    const textLength = text.length / maxTextLength;
    const inputTensor = tf.tensor2d([[textLength]]);
    const prediction = model.predict(inputTensor);
    const predictedValue = (await prediction.data())[0] * maxTimeToComplete;

    console.log("🔍 Entrada:", textLength);
    console.log("📊 Previsão:", predictedValue);

    return isNaN(predictedValue)
        ? "Erro na previsão"
        : Math.round(predictedValue) + " dias";
}

module.exports = { predictTime };
