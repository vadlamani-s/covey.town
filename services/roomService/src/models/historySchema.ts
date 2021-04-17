import { Schema, model } from 'mongoose';

/**
 * The History schema is used for the creation the Mongo database for storing the meeting information.
*/

const HistorySchema = new Schema({
  emailId: { type: String, required: true, index: { unique: false } },
  userName: { type:String },
  loginDate: { type: Date, default: new Date() },
  friendlyName: {type: String, required: true},
  coveyTownId: {type: String},
});
  
const HistoryModel = model('logininfo', HistorySchema, 'meetingsLog');

export default HistoryModel;