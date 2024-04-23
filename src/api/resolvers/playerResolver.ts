import {GraphQLError} from 'graphql';
import {Player, PlayerOutput} from '../../types/DBTypes';
import fetchData from '../../functions/fetchData';
import {MessageResponse} from '../../types/MessageTypes';
import {MyContext} from '../../types/MyContext';

export default {
  Query: {
    players: async (): Promise<PlayerOutput[]> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth server URL not found');
      }
      const players = await fetchData<Player[]>(
        process.env.AUTH_URL + '/players',
      );
      return players.map((player) => {
        player.id = player._id;
        return player;
      });
    },
    playerById: async (
      _parent: undefined,
      args: {id: string},
    ): Promise<PlayerOutput> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth server URL not found');
      }
      const player = await fetchData<Player>(
        process.env.AUTH_URL + '/players/' + args.id,
      );
      player.id = player._id;
      return player;
    },
    checkToken: async (
      _parent: undefined,
      args: undefined,
      context: MyContext,
    ) => {
      const response = {
        message: 'Token is valid',
        player: context.playerdata,
      };
      return response;
    },
  },
  Mutation: {
    register: async (
      _parent: undefined,
      args: {player: Omit<Player, 'role'>},
    ): Promise<{player: PlayerOutput; message: string}> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth URL not set in .env file');
      }
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(args.player),
      };
      console.log('args.player:', args.player);
      const registerResponse = await fetchData<
        MessageResponse & {data: Player}
      >(process.env.AUTH_URL + '/players', options);
      console.log('registerResponse:', registerResponse);

      if (!registerResponse.data || !registerResponse.data._id) {
        throw new GraphQLError('User registration failed');
      }

      return {
        player: {...registerResponse.data, id: registerResponse.data._id},
        message: registerResponse.message,
      };
    },
    login: async (
      _parent: undefined,
      args: {credentials: {playername: string; password: string}},
    ): Promise<MessageResponse & {token: string; player: PlayerOutput}> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth URL not set in .env file');
      }
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(args.credentials),
      };

      const loginResponse = await fetchData<
        MessageResponse & {token: string; player: PlayerOutput}
      >(process.env.AUTH_URL + '/auth/login', options);

      loginResponse.player.id = loginResponse.player._id;

      return loginResponse;
    },
    updatePlayer: async (
      _parent: undefined,
      args: {player: Omit<Player, 'role' | 'password'>},
      context: MyContext,
    ): Promise<{player: PlayerOutput; message: string}> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth URL not set in .env file');
      }

      // Check if the player is authenticated
      if (!context.playerdata) {
        throw new GraphQLError('User not authenticated');
      }

      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${context.playerdata?.token}`,
        },
        body: JSON.stringify(args.player),
      };

      const updateResponse = await fetchData<MessageResponse & {data: Player}>(
        process.env.AUTH_URL + '/players/' + context.playerdata.player._id,
        options,
      );

      updateResponse.data.id = updateResponse.data._id;

      return {player: updateResponse.data, message: updateResponse.message};
    },
    updatePlayerAsAdmin: async (
      _parent: undefined,
      args: {id: string; player: Omit<Player, 'role' | 'password'>},
      context: MyContext,
    ): Promise<{player: PlayerOutput; message: string}> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth URL not set in .env file');
      }

      // Check if the player is an admin
      if (context.playerdata?.role !== 'admin') {
        throw new GraphQLError('Only admins can update other players');
      }
      const options = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${context.playerdata?.token}`,
        },
        body: JSON.stringify(args.player),
      };

      const updateResponse = await fetchData<MessageResponse & {data: Player}>(
        process.env.AUTH_URL + '/players/' + args.id,
        options,
      );

      updateResponse.data.id = updateResponse.data._id;

      return {player: updateResponse.data, message: updateResponse.message};
    },
    deletePlayer: async (
      _parent: undefined,
      _args: {},
      context: MyContext,
    ): Promise<{
      message: string;
      player: Omit<Player, 'role' | 'password'>;
    }> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth URL not set in .env file');
      }

      // Check if the player is authenticated
      if (!context.playerdata) {
        throw new GraphQLError('User not authenticated');
      }

      // Fetch the player before deleting
      const playerResponse = await fetchData<{data: Player}>(
        process.env.AUTH_URL + '/players/' + context.playerdata.player._id,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${context.playerdata?.token}`,
          },
        },
      );

      const options = {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${context.playerdata?.token}`,
        },
      };

      const deleteResponse = await fetchData<MessageResponse>(
        process.env.AUTH_URL + '/players/' + context.playerdata.player._id,
        options,
      );

      return {message: deleteResponse.message, player: playerResponse.data};
    },
    deletePlayerAsAdmin: async (
      _parent: undefined,
      args: {id: string},
      context: MyContext,
    ): Promise<{
      message: string;
      player: Omit<Player, 'role' | 'password'>;
    }> => {
      if (!process.env.AUTH_URL) {
        throw new GraphQLError('Auth URL not set in .env file');
      }

      // Check if the player is an admin
      if (context.playerdata?.role !== 'admin') {
        throw new GraphQLError('Only admins can delete other players');
      }

      // Fetch the player before deleting
      const playerResponse = await fetchData<{data: Player}>(
        process.env.AUTH_URL + '/players/' + args.id,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${context.playerdata?.token}`,
          },
        },
      );

      const options = {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${context.playerdata?.token}`,
        },
      };

      const deleteResponse = await fetchData<MessageResponse>(
        process.env.AUTH_URL + '/players/' + args.id,
        options,
      );

      return {message: deleteResponse.message, player: playerResponse.data};
    },
  },
};
