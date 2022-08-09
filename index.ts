import startServer from './server';

const start = async () => {
  try {
    await startServer();
  } catch (e) {
    console.log('Not able to run server', e);
  }
};

start();
