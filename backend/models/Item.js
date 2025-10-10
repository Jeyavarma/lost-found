const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['lost', 'found', 'resolved'], default: 'lost' },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contactInfo: { type: String, required: true },
  imageUrl: String,
  locationImageUrl: String,
  dateReported: { type: Date, default: Date.now },
  timeReported: { type: String, required: true },
  timeLostFound: { type: String }, // When item was lost/found
  dateLostFound: { type: Date }, // Date item was lost/found
  locationDetails: {
    building: String,
    floor: String,
    room: String
  },
  culturalEvent: String,
  culturalEventOther: String,
  event: {
    type: String,
    enum: [
      'Madras Day Celebrations',
      'Annual Sports Meet', 
      'Cultural Festival',
      'Freshers Day',
      'College Day',
      'Inter-Collegiate Events',
      'Alumni Meet',
      'Science Exhibition'
    ]
  }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);