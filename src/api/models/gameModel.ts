/* eslint-disable prettier/prettier */
import mongoose from 'mongoose';
import {Game} from '../../types/DBTypes';

const gameSchema = new mongoose.Schema<Game>({
  user1: {
    type: String,
    required: [true, 'User1 is required'],
  },
  user2: {
    type: String,
    required: [true, 'User2 is required'],
  },
  winner: {
    type: String,
    required: [true, 'Winner is required'],
  },
});


export default mongoose.model<Game>('Game', gameSchema);
