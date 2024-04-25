/* eslint-disable prettier/prettier */
type ServerToClientEvents = {
  addGame: (message: string) => void;
};
type ClientToServerEvents = {
  update: (message: 'game') => void;
};

export {ServerToClientEvents, ClientToServerEvents};
