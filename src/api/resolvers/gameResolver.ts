/* eslint-disable prettier/prettier */
import {Game} from '../../types/DBTypes';
import {GraphQLError} from 'graphql';
import gameModel from '../models/gameModel';
import {MyContext} from '../../types/MyContext';

if (!process.env.SOCKET_URL) {
  throw new Error('SOCKET_URL not defined');
}

export default {
  Query: {
    games: async (): Promise<Game[]> => {
      return await gameModel.find();
    },

    gameById: async (_parent: undefined, args: {id: string}): Promise<Game> => {
      const game = await gameModel.findById(args.id);
      if (!game) {
        throw new GraphQLError('Game not found', {
          extensions: {
            code: '404',
          },
        });
      }
    return game;
    },
  },
  Mutation: {
    addGame: async (
      _parent: undefined,
      args: {game: Game},
      context: MyContext,
    ): Promise<{game: Game; message: string}> => {
      if (!context.userdata) {
        throw new GraphQLError('User not authenticated', {
          extensions: {
            code: '401 NOT AUTHENTICATED',
          },
        });
      }
      const newGame = new gameModel(args.game);
      await newGame.save();
      return {message: 'Game added successfully', game: newGame};
    },
    modifyGame: async (
      _parent: undefined,
      args: {game: Game; id: string},
      context: MyContext,
      ): Promise<{game: Game; message: string}> => {
        if (context.userdata?.role !== 'admin') {
          throw new GraphQLError('Unauthorized');
        }
        console.log('args', args);
        const game = await gameModel.findById(args.id);
        if (!game) {
          throw new GraphQLError('game not found');
        }
        await game.save();
        return {message: ' game modified', game: game};
      },
    },
};






/*
With authentication

*/



//no authentication
/*
    addGame: async (
    _parent: undefined,
    args: {game: Game},
    context: MyContext,
    ): Promise<{game: Game; message: string}> => {
    const newGame = new gameModel(args.game);
    await newGame.save();
    return {message: 'Game added successfully', game: newGame};
    },
    modifyGame: async (
    _parent: undefined,
    args: {game: Game; id: string},
    context: MyContext,
    ): Promise<{game: Game; message: string}> => {
      if (context.userdata?.role !== 'admin') {
        throw new GraphQLError('Unauthorized');
      }
      console.log('args', args);
      const game = await gameModel.findById(args.id);
      if (!game) {
        throw new GraphQLError('game not found');
      }
      await game.save();
      return {message: ' game modified', game: game};
    },
  },*/