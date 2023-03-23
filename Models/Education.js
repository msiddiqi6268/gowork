import mongoose, { SchemaTypes } from "mongoose";


const EducationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
    },
    education: [
        {
            id: { type: Number, requried: true },
            level:{
                type:String,
                required:true
            },
            institute:{
                type:String,
                required:true
            },
            title:{
                type:String,
                required:true
            },
            percentage:{
                type:mongoose.Decimal128 ,
                required:true
            },
            start_date:{
                type:Date,
                required:true
            },
            end_date:{
                type:Date,
                required:true
            }
        }

    ]
})

const decimal2JSON = (v, i, prev) => {
    if (v !== null && typeof v === 'object') {
      if (v.constructor.name === 'Decimal128')
        prev[i] = v.toString();
      else
        Object.entries(v).forEach(([key, value]) => decimal2JSON(value, key, prev ? prev[i] : v));
    }
  };

EducationSchema.set('toJSON', {
    transform: (doc, ret) => {
      decimal2JSON(ret);
      return ret;
    }
  });

const CandidateEducation = mongoose.model('CandidateEducation', EducationSchema)
export default CandidateEducation