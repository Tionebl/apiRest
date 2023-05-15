import express from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
// const apiUser = require('./authentication/api.user')

const app = express();
const charApi = require('./characters/api.characters.js')(app)

// Connection
async function startServer(): Promise<void> {
  try {
    await mongoose.connect('mongodb://BLavoine:BLavoine@b4s13b.stackhero-network.com:27017/BLavoine', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log('Connected to MongoDB');

    app.use(express.json());
    // app.use('/api', apiUser)
    app.use('/api', charApi)

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
}

export { startServer };