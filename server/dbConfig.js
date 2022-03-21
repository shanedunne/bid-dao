const mongoose = require('mongoose');
require('./models/Dao');

mongoose.connect(`mongodb+srv://biddaoadmin:${process.env.MONGODB_PASSWORD}@daocluster.n0dyw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
mongoose.set('debug', true);