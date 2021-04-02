import { mongo, Mongoose, Schema, model } from 'mongoose';


const HistorySchema = new Schema({
  emailId: { type: String, required: true, index: { unique: true } },
  loginDate: { type: Date, default: new Date() },
  RoomName: {type: String, required: true},
  RoomId: {type: String},
});
  
const HistoryModel = model('logininfo', HistorySchema, 'Login');

export default HistoryModel;