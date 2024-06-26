/* eslint-disable prettier/prettier */
import {Document, Types} from 'mongoose';

type User = Partial<Document> & {
  id: Types.ObjectId | string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  password: string;
  score: number;
};


type UserOutput = Omit<User, 'score'>;

type UserInput = Omit<User, 'id'>;

type UserTest = Partial<User>;

type LoginUser = Omit<User, 'password'>;

type TokenContent = {
  role: string;
  token: string;
  user: LoginUser;
};

type Game = Partial<Document> & {
  user1: string;
  user2: string;
  winner: string;
};

type GameTest = Partial<Game>;

export {
  User,
  UserOutput,
  UserInput,
  UserTest,
  Game,
  GameTest,
  LoginUser,
  TokenContent,
};
