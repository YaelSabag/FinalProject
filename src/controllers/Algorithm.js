// connection to db
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://margalit:cy426316@teampark.lohoh.mongodb.net/TeamPark?retryWrites=true&w=majority')
const db = mongoose.connection;

//import collections
const attractions = db.collection("attractions");
const users = db.collection("users");
const individuals = db.collection("individuals");

//requires
const Individual= require('../models/individual')
const generalVariabl =require('../models/generalVariables');
const Attraction =require('../models/attraction');
const User = require('../models/users');






var add_minutes =  function (dt, minutes) {
    return new Date(dt.getTime() + minutes*60000);
}

var add_hours =  function (dt, hours) {
    return new Date(dt.getTime() + hours*3600000);
}

// console.log("the fit of population: ",fit1 , fit2 , fit3 , fit4 , fit5 , fit6 )


// מכאן מתחיל לולאת for  }
// Selection- לבחור את ההכי טובים - הכי נמוכים






// crossover - בין הפרטים שבחרנו בשלב הקודם
// pop_arr=[pop_exmp1,pop_exmp2,pop_exmp3,pop_exmp4,pop_exmp5,pop_exmp6]
// x=pop_arr[0]
// console.log('try: ', x[0])
//
//
// function crossover(pop_arr) {
//
//     for (let i=0; i<pop_arr.length;++i) {
//
//
//     }
//
// }

// מוטציה על הילדים מהשלב הקודם

// מעריכים את הפרטים החדשים באוכלסיה

// משמיטים את הפרטים הפחות טובים

// כאן מסתיימת לולאת for {



var x = 0;

async function fitness(popID){
    let individualDoc = await Individual.findOne({popID: popID})
    max=0
    for (let i=0;i<individualDoc.array.length;i++){
        if( individualDoc.array[i][0].length > max)
            max=individualDoc.array[i][0].length
    }
    console.log(max)

    for (var j=0; j< max ; j++)//עמודה
    {
        for (var i = 0; i < individualDoc.array.length; i++) //שורה
        {
            switch (individualDoc.array[i][0][j]) { // המתקן שהבנאדם בחר
                case 1:
                    Enter_To_Attraction1(individualDoc.array[i][1], 11, popID, i)// id person, אובייקט של האטרקציה,
                break;
                case 2:
                    Enter_To_Attraction1(individualDoc.array[i][1], 22, popID, i, j)
                    break;
                case 3:
                    Enter_To_Attraction1(individualDoc.array[i][1], 33, popID, i, j)
                    break;
                case 4:
                    Enter_To_Attraction1(individualDoc.array[i][1], 44, popID, i, j)
                    break;
                case 5:
                    Enter_To_Attraction1(individualDoc.array[i][1], 55, popID, i, j)
                    break;
                default :
                    console.log('end of vector '+i)
                    break;

            }
            let promise = new Promise((resolve, reject) => {
                setTimeout(() => resolve("done!"), 1800)
            });

            let result = await promise;
            console.log(result);
        }
    }
    sum = 0
    d = new Date()
    d.setHours(8,0,0)
    console.log("d",d)
    User.find().then(
        response =>{
            response.forEach(function(u) {
                temp = (u.time-d)/60000

                console.log('temp',temp)
                sum +=temp
            });
        })
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve("done!"), 1000)
    });

    let result = await promise;
    console.log('result', result);
    avg = sum/individualDoc.array.length
    console.log('avg',avg)
    await Individual.findOneAndUpdate({popID: popID},{fitness:avg})
    reset_UserTime()
    resetAttractions()
    console.log('end fit')
}


//fitness(0)





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
}

function reset_UserTime(){
    d=new Date()
    User.updateMany({},{time:add_hours(new Date(d.getFullYear(),d.getMonth(),d.getDay()), 8)})
        .then(response=>{console.log("update")})
        .catch(error=>{console.log("error update")})
}

function resetAttractions(){
    d=new Date()
    Attraction.updateMany({},{countNow:0,time:add_hours(new Date(d.getFullYear(),d.getMonth(),d.getDay()), 8)})
        .then(response=>{console.log("update attraction")})
        .catch(error=>{console.log("error update attraction")})
}

// d=new Date()
//
// console.log(d.getHours())
// if(d.getHours()==15){
//     console.log("fffff")
// }
// d.setHours(8, 0, 0)
// console.log(d)



