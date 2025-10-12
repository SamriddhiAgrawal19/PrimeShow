import monngoose from 'mongoose';
const showSchema = new monngoose.Schema({
   movie : {type : String , required : true},
   showDateTime : {type : Date , required : true},
   showPrice : {type : Number , required : true},
   occupiedSeats : {type : Object , default : {}}
},{minimize : false}, {timestamps : true});


const Show = monngoose.model('Show', showSchema);

export default Show;
