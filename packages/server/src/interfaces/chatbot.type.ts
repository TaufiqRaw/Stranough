import TrainData from '../train-data.json'

export type UserIntent = keyof typeof TrainData.intents;