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



async function Evolution() {
    let MINtemp
    let iteration
    let sortedFitness_arr=[]
    let parents_arr=[]
    let delete_arr=[]
    let i
    console.log('start')
    for ( i = 1; i <= NUM_POP; ++i) {
        let fit=fitness(i).then(response=>{console.log('fitness succ')})
        sortedFitness_arr.push([fit,i])
        // דוחפים את הערך של כל פריט ואת את הID שלו שזה הi
        let promise = new Promise((resolve, reject) => {
            setTimeout(() => resolve("evol done :"), 3000)
        });
        let result = await promise;
        console.log("line 45: ",result,i);
    }
    sortedFitness_arr.sort()// ממיינים את המערך של כל הפיטנסים
    console.log("line 48: ",sortedFitness_arr)
    MINtemp=sortedFitness_arr[0]
    // רצים בלולאת פור למספר קבוע של איטרציות או שערך הפיטנס הקטן ביותר שמוזחר מתכנס ועוצרים
    // for(iteration=0 ; iteration<1 ;iteration++)
    // {
    //     console.log('iteration :',iteration)
    //     // selection
    //     // בוחרים את הפיטנסים הכי קטנים שיהיו ההורים לדור הבא
    //     for (let j=0;j<NUM_PARENTS;j++)
    //         parents_arr.push(sortedFitness_arr[j][1])
    //
    //     // creat new 3 pop in mongo
    //     // שולחים את ההורים עם הid לקרוסבר שיצור ילדים חדשים במונגו החל מהid שנשלח
    //     crossover(parents_arr, i).then(response=>{console.log('succeeded crossover')})
    //
    //     //  מעריכים את הפרטים החדשים באוכלסיה (הילדים) עם id חדש החל מהi הקודם, מכניסים אותם למערך הפיטנסים הכללי
    //     console.log('start fittnes')
    //     for (let k = i ; k < i+NUM_PARENTS; ++k) {
    //         sortedFitness_arr.push([fitness(k),k])
    //
    //         let promise = new Promise((resolve, reject) => {
    //             setTimeout(() => resolve("done!"), 3000)
    //         });
    //         let result = await promise;
    //         console.log(result);
    //     }
    //     // ממיינים שוב את המערך עם הפיטנס שהיו עד כה + הפיטנסים החדשים של הילדים
    //     sortedFitness_arr.sort()
    //     // console.log(sortedFitness_arr)
    //
    //     //מכניסים את הפרטים שנרצה למחוק לתוך מערך שאותו נשלח לדליט אינדיבדואל
    //
    //     for (let i=sortedFitness_arr.length-1 ; i > (sortedFitness_arr.length-NUM_DELETE); --i)
    //         delete_arr.push(sortedFitness_arr[i][1])
    //     // משמיטים את הפרטים הפחות טובים גם מהמערך הכללי של הפיטנסים
    //     for(let i=0;i<NUM_DELETE;i++)
    //         sortedFitness_arr.pop()
    //     // משמיטים את הפרטים הפחות טובים מהמונגו
    //     console.log('delete the worse individual')
    //     deleteIndividual(delete_arr).then(response=>{console.log('deleteIndividual succ')})
    //
    //     console.log('update id pop')
    //     // עדכון של כל הI של הפופלישיין
    //     updatePopID(delete_arr).then(response=>{console.log('updatePopID succ')})
    //
    //     console.log('sorted arr [0]',sortedFitness_arr[0])
    //     if(sortedFitness_arr[0][0]< MINtemp[0]){
    //         MINtemp=sortedFitness_arr[0]
    //     }
    //     console.log('MINtemp',MINtemp)
    // }
    //return של הפיטנס הכי קטן-הכי טוב
    console.log('=====================res====================',MINtemp)
    // generalVariabl.findOneAndUpdate({flag:0},{flag:1})
    // return MINtemp
}



async function crossover(parents_arr,newID){
    let child_A=[]
    let child_B=[]
    let temp=[]
    let index
    for(let i=0; i < parents_arr.length;i=i+2){
        console.log('i',i)
        let flag1=0
        let flag2=0
        await Individual.find().then(response=>{
            response.forEach(function (u){
                index=Math.trunc((u.array.length)/2)
                if(u.popID==parents_arr[i]&& flag1==0){
                    console.log('if 1')
                    child_A.push(...(u.array.splice(0,index)))
                    temp.push(...(u.array.splice(-index)))
                    flag1=1
                }
                if(u.popID==parents_arr[i+1]&& flag2==0){
                    console.log('if 2')
                    child_A.push(...(u.array.splice(-index)))
                    child_B.push(...(u.array.splice(0,index)))
                    child_B=child_B.concat(...(temp))
                    flag2=1
                }
            })
            //save to mongo
            let individual_1= new Individual({popID:newID+i,array:child_A})
            let individual_2= new Individual({popID:newID+i+1,array:child_B})
            individual_1.save()
            individual_2.save()
            // console.log('A',child_A)
            // console.log('B',child_B)
            child_A=[]
            child_B=[]
            temp=[]
        })


    }



// מוטציה על הילדים מהשלב הקודם

}

// crossover([1,2,3,4,5,6],11)


async function updatePopID(delete_arr) {
    let childrenID_arr = [NUM_POP + 1, NUM_POP + 2, NUM_POP + 3, NUM_POP + 4]
    let sizeDelete = delete_arr.length
    delete_arr.sort().reverse()
    for (let i = 0; i < sizeDelete; ++i) {
        await Individual.findOneAndUpdate({popID: {$in: childrenID_arr}}, {popID: delete_arr[delete_arr.length - 1]})
            .then(response => {
                console.log("update popID successful")
            })
            .catch(error => {
                console.log("error update popID")
            })
        delete_arr.pop()
    }
}


//1
async function fitness(popID) {
    let individualDoc = await Individual.findOne({popID: popID})
    let max = 0
    console.log("line 178: ",individualDoc);
    let promise1 = new Promise((resolve, reject) => {
        setTimeout(() => resolve("fit start"), 1800)
    });
    let result1 = await promise1;
    console.log("line 183: ",result1);

    for (let i=0;i<individualDoc.array.length;i++){
        if( individualDoc.array[i][0].length > max)
            max=individualDoc.array[i][0].length
    }
    console.log('line 189: max',max)

    for (let j=0; j< max ; j++)//עמודה כמות אנשים
    {
        for (let i = 0; i < individualDoc.array.length; i++) //שורה כמות מתקנים
        {
            Enter_To_Attraction1(individualDoc.array[i][1], individualDoc.array[i][0][j], popID, i)
                .then(response => {
                    console.log('line 197: Enter_To_Attraction1 succ')
                })
            let promise = new Promise((resolve, reject) => {
                setTimeout(() => resolve("done!"), 1800)
            });
            let result = await promise;
            console.log("line 203: ",result);
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
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve("line 220: done!"), 2000)
    });

    let result = await promise;
    console.log('line 224: result', result);

    let avg = sum/individualDoc.array.length
    console.log('line 227: avg',avg)
    await Individual.findOneAndUpdate({popID: popID},{fitness:avg})
    reset_UserTime().then(response=>{console.log('reset_UserTime in fitness succ')})
    let promise2 = new Promise((resolve, reject) => {
        setTimeout(() => resolve("fit start"), 2000)
    });
    let result2 = await promise2;
    console.log(result2);
    resetAttractions().then(response=>{console.log('resetAttractions in fitness succ')})
    let promise3 = new Promise((resolve, reject) => {
        setTimeout(() => resolve("line 237: fit start"), 2000)
    });
    let result3 = await promise3;
    console.log(result3);
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

async function deleteIndividual(delete_arr){

    await Individual.deleteMany({popID:{$in:delete_arr}})
        .then(response=>{
            console.log('Individuals Deleted successfully')
        })
        .catch(error => {
            console.log('error Individuals Delete')
        })
}

//time functions
const add_minutes =  function (dt, minutes) {
    return new Date(dt.getTime() + minutes*60000);
}
const add_hours =  function (dt, hours) {
    return new Date(dt.getTime() + hours*3600000);
}

// //
// reset_UserTime().then(response=>{console.log('reset_UserTime succ')})
// resetAttractions().then(response=>{console.log('resetAttractions succ')})

//
Evolution().then(response=>{
    console.log('========end======')})

// fitness(1).then(response=>{console.log('rrrrr')})


