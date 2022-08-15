if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const mongoose = require('mongoose')
// const cities = require('./cities')
const Hiking = require('../models/Hiking')
// const axios = require("axios")
const trails = require("./trail")

const dbUrl = process.env.DB_URL;
// const dbUrl = 'mongodb://localhost:27017/hiking'; //27017 is default port number. using test database
async function main() {
    await mongoose.connect(dbUrl);
}
main().catch(err => console.log('Error!', err));
main().then(() => console.log("Mongoose Connected!"))

const seedDB = async () => {
    //BE CAREFUL!!! THIS LINE DELETE EVERYTHING!
    await Hiking.deleteMany({});

    // const options = {
    //     method: 'GET',
    //     url: 'https://trailapi-trailapi.p.rapidapi.com/trails/explore/',
    //     params: { lat: '43', lon: '-80' },
    //     headers: {
    //         'X-RapidAPI-Key': '458c1273aemshaf277afa13d3924p1e4be8jsn2708694abc3d',
    //         'X-RapidAPI-Host': 'trailapi-trailapi.p.rapidapi.com'
    //     }
    // };

    // axios.request(options).then(function (response) {
    //     console.log(response.data);
    // }).catch(function (error) {
    //     console.error(error);
    // });
    for (let trail of trails) {
        // console.log(trail);
        var url = trail.thumbnail;
        if (!url) {
            url = "http://source.unsplash.com/collection/371513"
        }
        console.log(url)
        const seed = new Hiking({
            title: trail.name,
            location: `${trail.city}, ${trail.region}, ${trail.country}`,
            lengthKM: trail.length,
            image: [
                {
                    url: url,
                    filename: `HikingYelp/${trail.id}`,
                },
                {
                    url: 'https://res.cloudinary.com/dr57pfprz/image/upload/v1660529082/HikingYelp/photo-1587502537745-84b86da1204f_jxmoqb.jpg',
                    filename: 'HikingYelp/photo-1587502537745-84b86da1204f_jxmoqb',
                }
            ],
            description: trail.description,
            difficulty: trail.difficulty
        })
        // console.log(seed)
        await seed.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})