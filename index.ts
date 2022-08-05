import startServer from './server';

const start = async () => {
  try {
    await startServer();
  } catch {
    console.log('Not able to run server');
  }
};

start();
