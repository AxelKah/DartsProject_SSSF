/* eslint-disable prettier/prettier */
import {Query} from 'mongoose';
import {Game, GameOutput, UserOutput} from '../../types/DBTypes';
import {GraphQLError} from 'graphql';
import fetchData from '../../functions/fetchData';
import gameModel from '../models/gameModel';
import { MyContext } from '../../types/MyContext';

import {io, Socket} from 'socket.io-client';
import {ClientToServerEvents, ServerToClientEvents} from '../../types/Socket';

if (!process.env.SOCKET_URL) {
  throw new Error('SOCKET_URL not defined');
}
// socket io client
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  process.env.SOCKET_URL,
);

export default {
    Query: {
        games: async (): Promise<Game[]> => {
            return await gameModel.find();
        },
        game: async (_parent: undefined, args: {id: string}): Promise<Game> => {
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
            args: {game: Omit<Game, '_id'>},
            context: MyContext,
        ): Promise<{message: string; game?: Game}> => {
            if (!context.userdata) {
                throw new GraphQLError('User not authenticated', {
                    extensions: {
                        code: '401',
                    },
                });
            }
            const game = await gameModel.create(args.game);
            if(game) {
                socket.emit('update', 'game');
                return {message: 'Game added successfully', game};
            } else {
                return {message: 'Game not added'};
            }
    },
    },
};
