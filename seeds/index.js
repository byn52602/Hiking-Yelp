const mongoose = require('mongoose')
const cities = require('./cities')
const Hiking = require('../models/Hiking')


async function main() {
    await mongoose.connect('mongodb://localhost:27017/hiking'); //27017 is default port number. using test database
}
main().catch(err => console.log('Error!', err));
main().then(() => console.log("Mongoose Connected!"))

const seedDB = async () => {
    //BE CAREFUL!!! THIS LINE DELETE EVERYTHING!
    await Hiking.deleteMany({});

    for (let i = 0; i < 50; i++) {
        const randomCity = Math.floor(Math.random() * 1739);
        const randomLength = Math.floor(Math.random() * 20) + 2;
        const sd = new Hiking({
            title: `Hiking Trail ${i}`,
            location: `${cities[randomCity].city}, ${cities[randomCity].province_id}`,
            lengthKM: randomLength,
            image: 'http://source.unsplash.com/collection/371513',
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur dignissimos quibusdam itaque eius necessitatibus, perferendis ab. Ipsum excepturi, praesentium at corporis beatae placeat pariatur voluptas eligendi numquam quae fuga obcaecati.",
            hours: "5am-5pm"
        })
        await sd.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});