// connection to db
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://margalit:cy426316@teampark.lohoh.mongodb.net/TeamPark?retryWrites=true&w=majority')
    .then(response=>{console.log('connected')})

// setTimeout(Evolution, 2000)
// const db = mongoose.connection;

//import collections
// const attractions = db.collection("attractions");
// const users = db.collection("users");
// // const individuals = db.collection("individuals");
// var attractions2 = db.collection("attractions");

//requires
const Individual= require('../models/individual')
const generalVariabl =require('../models/generalVariables');
const Attraction =require('../models/attraction');
const User = require('../models/users');

// const variable
const NUM_POP=10
const NUM_PARENTS=4
const NUM_DELETE=4





//time functions
const add_minutes =  function (dt, minutes) {
    return new Date(dt.getTime() + minutes*60000);
}
const add_hours =  function (dt, hours) {
    return new Date(dt.getTime() + hours*3600000);
}


//1
async function fitness(popID,myCallback) {
    let individualDoc = await Individual.findOne({popID: popID})
    let max = 0
    console.log("line 178: ",individualDoc);

    for (let i=0;i<individualDoc.array.length;i++){
        if( individualDoc.array[i][0].length > max)
            max=individualDoc.array[i][0].length
    }
    console.log('line 189: max',max)

    let i,flag,num=0;
    for (let j=0; j< max ;j++)//עמודה כמות אנשים
    {
        for (i = 0; i < individualDoc.array.length; ) //שורה כמות מתקנים
        {
            while (i!= i+1) {
                myCallback(individualDoc.array[i][1], individualDoc.array[i][0][j], popID, i)
                    .then(response => {
                        i = i + 1
                        console.log('line 197: Enter_To_Attraction1 succ')
                    })

            }
        }
    }
    let sum = 0
    let d = new Date()
    d.setHours(2,0,0)
    // console.log("d",d)
    User.find().then(
        response =>{
            response.forEach(function(u) {
                let temp = (u.time-d)/60000

                console.log('line 215: temp',temp)
                sum +=temp
            });
        })


    let avg = sum/individualDoc.array.length
    console.log('line 227: avg',avg)
    await Individual.findOneAndUpdate({popID: popID},{fitness:avg})

    reset_UserTime().then(response=>{console.log('reset_UserTime in fitness succ')})

    resetAttractions().then(response=>{console.log('resetAttractions in fitness succ')})

    console.log('end fit')
    return avg
}





//2
async  function  Enter_To_Attraction1 (userID,attractionID,popID,i,j) {
    console.log('send UserID: ',userID,'attID',attractionID)

    let individualDoc = await Individual.findOne({popID:popID})
    let attractionDoc = await Attraction.findOne({attractionID: attractionID})
    let userDoc = await User.findOne({userID: userID})

    individualDoc.array[i][2].push(add_minutes(userDoc.time, attractionDoc.Round))
    console.log(individualDoc.array[i])

    if (attractionDoc.countNow == 0 && userDoc.time <= attractionDoc.time) {   //של המתקן שווה ל0 זא שהסיבוב  ריק count
        console.log('if 1')
        await Attraction.findOneAndUpdate({attractionID: attractionID}, {$inc: {countNow: 1}})// מכניסים בנאדם ומקדמים את הקוואנט
        await User.findOneAndUpdate({userID: userID}, {$set: {time: add_minutes(userDoc.time, attractionDoc.Round)}})  //לגשת לשדה טיים של היוזר ולהוסיף את הזמן של המתקן
        await Individual.findOneAndUpdate({popID:popID},{$set:{array: individualDoc.array}})
    }

    // יש אנשים כבר בתור ואנחנו רוצים להסויף מישהו
    else {
        // אם הזמן של היוזר קטן מהזמן הנוכחי של המתקן כלומר שאפשר להכניס אותו לסיבוב הקרוב && שיש מקום בסיבוב
        if (userDoc.time <= attractionDoc.time && attractionDoc.countNow < attractionDoc.capacity) {
            console.log('if 2')
            await Attraction.findOneAndUpdate({attractionID: attractionID}, {$inc: {countNow: 1}}) // מקדמת את הקוואנט של התור -הסיבוב הנוכחי
            await User.findOneAndUpdate({userID: userID}, {$set: {time: add_minutes(attractionDoc.time, attractionDoc.Round)}})// מעדכנת את השעה של היוזר
            await Individual.findOneAndUpdate({popID:popID},{$set:{array: individualDoc.array}})
        }

        // היוזר הגיע בזמן אבל איו מקום בסיבוב הנוכחי
        else if (userDoc.time <= attractionDoc.time && attractionDoc.countNow == attractionDoc.capacity) {
            console.log('else if')
            await Attraction.findOneAndUpdate({attractionID: attractionID}, {$set: {time: add_minutes(attractionDoc.time, attractionDoc.Round)}}) // מעדכנים את הטיים של המתקן לסיבוב הבא
            attractionDoc.time=add_minutes(attractionDoc.time, attractionDoc.Round)
            await Attraction.findOneAndUpdate({attractionID: attractionID}, {$set: {countNow: 1}})// מוסיפים את הבנאדם לסיבוב החדש
            await User.findOneAndUpdate({userID: userID}, {$set: {time: add_minutes(attractionDoc.time, attractionDoc.Round)}}) //מעדכנים הטיים של היוזר לטיים האחרון של המתקן
            await Individual.findOneAndUpdate({popID:popID},{$set:{array: individualDoc.array}})
        }

        // היוזר איחר למתקן
        else {
            console.log('else')
            // כאן נוצר חור אך כשנעשה פיטנס נקח את התוצאה הטובה ביותר והפרטים עם החור ירדו או שנקח את הפתרון עם החור הכי קטן
            while (userDoc.time > attractionDoc.time){
                await Attraction.findOneAndUpdate({attractionID: attractionID}, {$set: {time: add_minutes(attractionDoc.time, attractionDoc.Round)}}) // מוסיפים את החור שנוצר לזמן האחרון של המתקן
                attractionDoc.time=add_minutes(attractionDoc.time, attractionDoc.Round)// מעדכנים גם את המשתנה שיוקדם בהתאם בשביל תנאי while
                console.log('att time inc ' ,attractionDoc.time)
            }
            await Attraction.findOneAndUpdate({attractionID: attractionID}, {$set: {countNow: 1}})// מוסיפים את הבנאדם לסיבוב החדש
            await User.findOneAndUpdate({userID: userID}, {$set: {time: add_minutes(attractionDoc.time, attractionDoc.Round)}}) //לגשת לשדה טיים של היוזר ולהוסיף את הזמן של המתקן
            await Individual.findOneAndUpdate({popID:popID},{$set:{array: individualDoc.array}})
        }
    }
    // return i+1;
}




//reset database
async function reset_UserTime(){
    let d=new Date()

    await User.updateMany({},{time:add_hours(new Date(d.getFullYear(),d.getMonth(),d.getDate()), 8)})
        .then(response=>{console.log("line 303: update")})
        .catch(error=>{console.log("error update")})

}
async function resetAttractions(){
    let d=new Date()
    await Attraction.updateMany({},{countNow:0,time:add_hours(new Date(d.getFullYear(),d.getMonth(),d.getDate()), 8)})
        .then(response=>{console.log("line 310: update attraction")})
        .catch(error=>{console.log("error update attraction")})

}

//
// reset_UserTime().then(response=>{console.log('reset_UserTime succ')})
// resetAttractions().then(response=>{console.log('resetAttractions succ')})

fitness(4, Enter_To_Attraction1).then(res=>{console.log("succeeded")})

















































