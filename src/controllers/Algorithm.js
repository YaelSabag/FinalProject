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

// הגרלת אוכלסיה של 10 פרטים באופן אקראי
pop_exmp1=[[1,2,3,4,5],[1,2,5,3],[1,4,3,2,5],[1,5,4,3,2]]
pop_exmp2=[[1,4,3,2,5],[1,5,4,3,2],[1,2,3,4,5],[1,2,5,4,3]]
pop_exmp3=[[1,2,5,3],[1,2,3,4,5],[1,4,3,2,5],[1,5,4,3,2]]
pop_exmp4=[[2,4,3,1,5],[1,2,3,4,5],[1,2,5,4,3],[1,4,5,3,2]]
pop_exmp5=[[1,2,3,4,5],[1,4,3,2,5],[1,5,4,3,2],[5,2,1,3]]
pop_exmp6=[[2,1,3,4,5],[1,4,3,2,5],[1,5,4,3,2],[5,3,1,2]]



// להעריך כל פרט באוכלסיה ע"י ה fittnes

fit1=fitness(pop_exmp1)
fit2=fitness(pop_exmp2)
fit3=fitness(pop_exmp3)
fit4=fitness(pop_exmp4)
fit5=fitness(pop_exmp5)
fit6=fitness(pop_exmp6)



// console.log("the fit of population: ",fit1 , fit2 , fit3 , fit4 , fit5 , fit6 )


// מכאן מתחיל לולאת for  }
// Selection- לבחור את ההכי טובים - הכי נמוכים


var fit_arr=[fit1 , fit2 , fit3 , fit4 , fit5 , fit6 ]
fit_arr.sort(function(a, b) {
    return a - b;
});

// console.log("sorted fit array: ",fit_arr);
parent1=fit_arr[0]
parent2=fit_arr[1]
parent3=fit_arr[2]


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



function fitness(population){
//population is matrix of selected attractions arrays
//attractions  -   [0]-count , [1]-time
    var attraction_1=[0,0]
    var attraction_2=[0,0]
    var attraction_3=[0,0]
    var attraction_4=[0,0]
    var attraction_5=[0,0]
//persons
    const persons_arr=[8,8,8,8] // זמן כניסה התחלתי של כל המבקרים

    // max length of array for running
    var len_array=[]
    for( let i=0;i<population.length;i++)
    {
        len_array.push(population[i].length)
    }
    var max_len=Math.max(...len_array); // חיפשנו את המערך הכי ארוך ועד אליו רצנו בריצה על המטריצה


    for (var j=0; j< max_len ; j++)//עמודה
    {
        for (var i=0; i< population.length ; i++) //שורה
        {
            switch (population[i][j]) { // המתקן שהבנאדם בחר
                case 1:
                    Enter_To_Attraction(i, attraction_1, 1, 3)// id person, אובייקט של האטרקציה,
                    break;
                case 2:
                    Enter_To_Attraction(i, attraction_2, 3, 3)
                    break;
                case 3:
                    Enter_To_Attraction(i, attraction_3, 2, 2)
                    break;
                case 4:
                    Enter_To_Attraction(i, attraction_4, 1, 6)
                    break;
                case 5:
                    Enter_To_Attraction(i, attraction_5, 4, 8)
                    break;
                default :
                    // console.log('end of vector '+i)
                    break;

            }

        }
    }

    // calc average waiting time for solution
    var total_time=0
    for(let i=0;i<persons_arr.length ; i++)
        total_time+=persons_arr[i]
    var avg=total_time/persons_arr.length
    //
    // // print
    // console.log(attraction_1)
    // console.log(attraction_2)
    // console.log(attraction_3)
    // console.log(attraction_4)
    // console.log(attraction_5)
    // console.log(persons_arr)
    // console.log('avg:',avg)

    return avg




    //attractions  -   [0]-count , [1]-time
    function  Enter_To_Attraction( id ,attraction, round,top) {

        if (attraction[0] == 0) {   // count==0     //של המתקן שווה ל0 זא שהסיבוב  ריק count
            attraction[0]++ // מכניסים בנאדם ומקדמים את הקוואנט
            persons_arr[id] += round //לגשת לשדה טיים של היוזר ולהוסיף את הזמן של המתקן
            attraction[1] += round // מוסיפים את הזמן של הראונד לטיים של המתקן
        }

        else { // יש אנשים כבר בתור ואנחנו רוצים להסויף מישהו
            //persons_arr[id]  הזמן של היוזר בכל רגע


            // אם הזמן של היוזר קטן מהזמן הנוכחי של המתקן כלומר שאפשר להכניס אותו לסיבוב הקרוב && שיש מקום בסיבוב
            if (persons_arr[id] < attraction[1] && attraction[0] < top) {
                attraction[0]++ // מקדמת את הקוואנט של התור -הסיבוב הנוכחי
                persons_arr[id] += round // מעדכנת את השעה של היוזר
                if (attraction[0] == top) { // אם אחרי ההסופה נגמר המקום בתור
                    attraction[1] += round //  מעדכנים את השעה של המתקן לסיבוב הבא
                    attraction[0] = 0 // מאפסים את הקוואנט של הסיבוב החדש
                }



                // היוזר הגיע בזמן אבל איו מקום בסיבוב הנוכחי
            } else if (persons_arr[id] < attraction[1] && attraction[0] >= top) {
                attraction[1] += round // מעדכנים את הטיים של המתקן לסיבוב הבא
                attraction[0] = 1 // מוסיפים את הבנאדם לסיבוב החדש
                persons_arr[id] += attraction[1] //מעדכנים הטיים של היוזר
                //   persons_arr[id] = attraction[1]  עושים השמה של הזמן הסופי של המתקן לתוך הטיים של היוזר




            } else { // (persons_arr[id] > Time_A)
                while (persons_arr[id] > attraction[1])
                    attraction[1]+=round // מוסיפים את החור שנוצר לזמן של המתקן

                //attraction[0]=0 מה שהיה לפני
                attraction[0]=1 // מוסיפים את הבנאדם לסיבוב החדש
                persons_arr[id] += round //לגשת לשדה טיים של היוזר ולהוסיף את הזמן של המתקן
                attraction[1] += round // אמור לסיים את הסיבוב בשעה הזאת
            }


        }
    }

}






async  function  Enter_To_Attraction1 (userID,attractionID) {
    let attractionDoc = await Attraction.findOne({attractionID: attractionID})
    let userDoc = await User.findOne({userID: userID})

    if (attractionDoc.countNow == 0) {   //של המתקן שווה ל0 זא שהסיבוב  ריק count
        console.log('if 1')
        await Attraction.findOneAndUpdate({attractionID: attractionID}, {$inc: {countNow: 1}})// מכניסים בנאדם ומקדמים את הקוואנט
        await User.findOneAndUpdate({userID: userID}, {$set: {time: add_minutes(userDoc.time, attractionDoc.Round)}})  //לגשת לשדה טיים של היוזר ולהוסיף את הזמן של המתקן
        await Attraction.findOneAndUpdate({attractionID: attractionID}, {$set: {time: add_minutes(attractionDoc.time, attractionDoc.Round)}}) // מוסיפים את הזמן של הראונד לטיים של המתקן
    }


        // יש אנשים כבר בתור ואנחנו רוצים להסויף מישהו
    //persons_arr[id]  הזמן של היוזר בכל רגע
    else {

        // אם הזמן של היוזר קטן מהזמן הנוכחי של המתקן כלומר שאפשר להכניס אותו לסיבוב הקרוב && שיש מקום בסיבוב
        if (userDoc.time < attractionDoc.time && attractionDoc.countNow < attractionDoc.capacity) {
            console.log('if 2')
            await Attraction.findOneAndUpdate({attractionID: attractionID}, {$inc: {countNow: 1}}) // מקדמת את הקוואנט של התור -הסיבוב הנוכחי
            await User.findOneAndUpdate({userID: userID}, {$set: {time: add_minutes(attractionDoc.time, attractionDoc.Round)}})// מעדכנת את השעה של היוזר

            // if ((attractionDoc.countNow+=1)== attractionDoc.capacity) { // אם אחרי ההסופה נגמר המקום בתור
            //     console.log(attractionDoc.countNow)
            //     await Attraction.findOneAndUpdate({attractionID: attractionID}, {$set: {time: add_minutes(attractionDoc.time, attractionDoc.Round)}})//  מעדכנים את השעה של המתקן לסיבוב הבא
            //     await Attraction.findOneAndUpdate({attractionID: attractionID}, {$set: {countNow: 0}})// מאפסים את הקוואנט של הסיבוב החדש
            //     }
        }

        // היוזר הגיע בזמן אבל איו מקום בסיבוב הנוכחי
            else if (userDoc.time < attractionDoc.time && attractionDoc.countNow >= attractionDoc.capacity) {
                console.log('else if')
                await Attraction.findOneAndUpdate({attractionID: attractionID}, {$set: {time: add_minutes(attractionDoc.time, attractionDoc.Round)}}) // מעדכנים את הטיים של המתקן לסיבוב הבא
                await Attraction.findOneAndUpdate({attractionID: attractionID}, {$set: {countNow: 1}})// מוסיפים את הבנאדם לסיבוב החדש
                await User.findOneAndUpdate({userID: userID}, {$set: {time: add_minutes(attractionDoc.time, attractionDoc.Round)}}) //מעדכנים הטיים של היוזר לטיים האחרון של המתקן
            }

            // היוזר איחר למתקן
            else {
                console.log('else')
                    // כאן נוצר חור אך כשנעשה פיטנס נקח את התוצאה הטובה ביותר והפרטים עם החור ירדו או שנקח את הפתרון עם החור הכי קטן
                while (userDoc.time >= attractionDoc.time){
                    await Attraction.findOneAndUpdate({attractionID: attractionID}, {$set: {time: add_minutes(attractionDoc.time, attractionDoc.Round)}}) // מוסיפים את החור שנוצר לזמן האחרון של המתקן
                    attractionDoc.time=add_minutes(attractionDoc.time, attractionDoc.Round)// מעדכנים גם את המשתנה שיוקדם בהתאם בשביל תנאי while
                    console.log('att time inc ' ,attractionDoc.time)
                }
                //attraction[0]=0 מה שהיה לפני
                await Attraction.findOneAndUpdate({attractionID: attractionID}, {$set: {countNow: 1}})// מוסיפים את הבנאדם לסיבוב החדש
                await User.findOneAndUpdate({userID: userID}, {$set: {time: add_minutes(attractionDoc.time, attractionDoc.Round)}}) //לגשת לשדה טיים של היוזר ולהוסיף את הזמן של המתקן
                await Attraction.findOneAndUpdate({attractionID: attractionID}, {$set: {time: add_minutes(attractionDoc.time, attractionDoc.Round)}}) // מעדכנים את הטיים של המתקן לסיבוב הבא
            }

            // חייבת להבין למה מקדמים את הראונד של המתקן כל פעם שמוסיפים בנאדם


    }
}

Enter_To_Attraction1(1111,454545)



// async function start() {
//     var doc = await Attraction.findOne({attractionID: 121212});
//     console.log('try',doc.Round)
// }
//
// start()







// console.log(add_minutes(new Date(), 5).toLocaleTimeString());











