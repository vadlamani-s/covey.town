import { Schema, model } from 'mongoose';


const HistorySchema = new Schema({
  emailId: { type: String, required: true, index: { unique: false } },
  userName: { type:String },
  loginDate: { type: Date, default: new Date() },
  friendlyName: {type: String, required: true},
  coveyTownId: {type: String},
});
  
const HistoryModel = model('logininfo', HistorySchema, 'meetingsLog');

export default HistoryModel;