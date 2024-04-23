import {Document, Types} from 'mongoose';

type Player = Partial<Document> & {
  id: Types.ObjectId | string;
  name: string;
  email: string;
  role: 'player' | 'admin';
  password: string;
  score: number;
};

type PlayerOutput = Omit<Player, 'score'>;

type PlayerInput = Omit<Player, 'id'>;

type PlayerTest = Partial<Player>;

type LoginPlayer = Omit<Player, 'password'>;

type TokenContent = {
  role: string;
  token: string;
  player: LoginPlayer;
};

type Game = Partial<Document> & {
  id?: Types.ObjectId | string;
  name: string;
  players: Types.ObjectId[] | Player[];
  winner: Types.ObjectId | Player;
  startDate: Date;
  endDate: Date;
};

type GameTest = Partial<Game>;

export {
  Player,
  PlayerOutput,
  PlayerInput,
  PlayerTest,
  Game,
  GameTest,
  LoginPlayer,
  TokenContent,
};
