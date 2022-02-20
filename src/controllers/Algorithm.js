// connection to db
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://margalit:cy426316@teampark.lohoh.mongodb.net/TeamPark?retryWrites=true&w=majority')
    .then(response=>{console.log('connected')})





//requires
const Individual= require('../models/individual')
const generalVariable =require('../models/generalVariables');
const Attraction =require('../models/attraction');
const User = require('../models/users');

// const variable
const NUM_POP=10
const NUM_PARENTS=4
const NUM_DELETE=4



async function Evolution() {
    let closeArr=[]
    let NowResult  // הערך הכי טוב באיטרציה הנוכחית
    let BestResult //הערך הכי טוב הכללי
    let iteration
    let sortedFitness_arr = []  // מערך כללי של הפיטנסים, כולל החדשים
    let parents_arr = []   // מערך של הפיטנסים הכי קטנים שמהם יוצרים ילדים
    let delete_arr = []    // מערך של הפיטנסים הכי גדולים שאותם מוחקים
    let i
    //let fit
    console.log('start')
    for (i = 1; i <= NUM_POP; ++i) {
        await fitness(i).then(response => {
            console.log('fitness succeed', response)
            sortedFitness_arr.push([response, i])
        })
            .catch(error => {
                console.log("error", error)
            })
        //sortedFitness_arr.push([fit,i]) // דוחפים את הערך של כל פריט ואת את הID שלו שזה הi
        //let result = await promise;
    }
    sortedFitness_arr.sort((a, b) => a[0] - b[0])//     ממיינים את המערך של כל הפיטנסים
    console.log("line 48: ", sortedFitness_arr)
    BestResult = sortedFitness_arr[0]

    // רצים בלולאת פור למספר קבוע של איטרציות או שערך הפיטנס הקטן ביותר שמוזחר מתכנס ועוצרים
    for(iteration=0 ; iteration< 10 ;iteration++)
    {
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ iteration :',iteration)

        //// selection
        //     // בוחרים את הפיטנסים הכי קטנים שיהיו ההורים לדור הבא
        for (let j = 0; j < NUM_PARENTS; j++)
            parents_arr.push(sortedFitness_arr[j][1])

        //// creat new  pop in mongo
        //     // שולחים את ההורים עם הid לקרוסבר שיצור ילדים חדשים במונגו החל מה id שנשלח
        console.log(i, "-------------------------------------------------------------------------")
        parents_arr.sort((a, b) => a - b)
        await crossover(parents_arr, i).then(response => {
            console.log('succeeded crossover')
        })

        ////  מעריכים את הפרטים החדשים באוכלסיה (הילדים) עם id חדש החל מהi הקודם, מכניסים אותם למערך הפיטנסים הכללי
        for (let k = i; k < i + NUM_PARENTS; ++k) {
            console.log("line 66 k:", k)
            await fitness(k).then(response => {
                console.log('fitness 2 succeed', response);
                sortedFitness_arr.push([response, k]);
            })
        }

        //     // ממיינים שוב את המערך עם הפיטנס שהיו עד כה + הפיטנסים החדשים של הילדים
        sortedFitness_arr.sort((a, b) => a[0] - b[0])
        // console.log(sortedFitness_arr)

        //     //מכניסים את הפרטים שנרצה למחוק לתוך מערך שאותו נשלח לדליט אינדיבדואל
        for (let i = sortedFitness_arr.length-1; i >= (sortedFitness_arr.length - NUM_DELETE); --i) {
            delete_arr.push(sortedFitness_arr[i][1])
        }

        //     // משמיטים את הפרטים הפחות טובים גם מהמערך הכללי של הפיטנסים
        for (let i = 0; i < NUM_DELETE; i++) {
            sortedFitness_arr.pop()
        }

        //     // משמיטים את הפרטים הפחות טובים מהמונגו
        await deleteIndividual(delete_arr).then(response => {
            console.log('delete Individual succeed')
        })

        //     // עדכון של כל הI של הפופלישיין
        await updatePopID(delete_arr).then(response => {
            console.log('updatePopID succeed')
        })
        sortedFitness_arr = []
        await Individual.find().then(response=>{
            response.forEach(function(u) {
                sortedFitness_arr.push([u.fitness,u.popID])
            })
        })
        sortedFitness_arr.sort((a, b) => a[0] - b[0])
        console.log('line 96:', sortedFitness_arr)

        //לוקחים מהמונגו את הפיטנס הכי קטן אחרי העדכון
        BestResult=await Individual.findOne().sort({fitness:1}).then(result=>
        {console.log("sort",result)
            NowResult = [result.fitness, result.popID];
            if (NowResult[0] < BestResult[0]) {
                BestResult = NowResult
            }

            console.log('BestResult', BestResult)
            return BestResult

        })


        parents_arr = []
        closeArr.push(BestResult)

    }// סוגריים של הפור של הדורות

    //return של הפיטנס הכי קטן-הכי טוב
    console.log('===================== final res ====================',BestResult,Date.now())
    console.log("close ARR",closeArr)
    await generalVariable.findOneAndUpdate({name:"flag"},{flag:1}).then(response=>{console.log('succeeded update flag')})
}










async function crossover(parents_arr,newID) {
    console.log('parents_arr sorttt ????',parents_arr)
    let child_A = []
    let child_B = []
    let temp = []
    let index
    let tempTrans = []
    let LateArray = []
    let LateArray_temp = []
    for (let i = 0; i < parents_arr.length; i = i + 2) {
        console.log('i', i)
        let flag1 = 0
        let flag2 = 0
        await Individual.find().sort({popID:1}).then(async response => {
            response.forEach(function (u) {
                console.log('u.popID', u.popID)
                index = Math.trunc((u.array.length) / 2)

                if (u.popID == parents_arr[i] && flag1 == 0) {
                    console.log('##################if 1')
                    child_A.push(...(u.array.splice(0, index)))
                    temp.push(...(u.array.splice(-index)))
                    flag1 = 1
                    console.log('temp', temp)
                    LateArray_temp.push(...(u.LateArray))
                }
                if (u.popID == parents_arr[i + 1] && flag2 == 0) {
                    console.log('##################if 2')
                    child_A.push(...(u.array.splice(-index)))
                    child_B.push(...(u.array.splice(0, index)))
                    child_B.push(...(temp))
                    flag2 = 1
                    LateArray_temp.push(...(u.LateArray))
                }
            })
            console.log("before mutation:++++++++++")
            console.log('A', child_A)
            console.log('B', child_B)
            ///////mutation
            LateArray = [...new Set(LateArray_temp)];
            console.log("LateArray", LateArray)
            let TransIndexA = index-1
            let TransIndexB = index-1
                for(let a = 0; a<index; a++)
                {
                    if(LateArray.includes(child_A[a][1]))
                    {
                        tempTrans = child_A[a]
                        child_A[a] = child_A[TransIndexA]
                        child_A[TransIndexA] = tempTrans
                        //TransIndexA = TransIndexA-1
                    }
                    if(LateArray.includes(child_B[a][1]))
                    {
                        tempTrans = child_B[a]
                        child_B[a] = child_B[TransIndexB]
                        child_B[TransIndexB] = tempTrans
                        //TransIndexB = TransIndexB-1
                    }
                }

            TransIndexA = child_A.length-1
            TransIndexB = child_A.length-1
                for(let a = index; a<child_A.length-1; a++)
                {
                    if(LateArray.includes(child_A[a][1]))
                    {
                        tempTrans = child_A[a]
                        child_A[a] = child_A[TransIndexA]
                        child_A[TransIndexA] = tempTrans
                        //TransIndexA = TransIndexA-1
                    }
                    if(LateArray.includes(child_B[a][1]))
                    {
                        tempTrans = child_B[a]
                        child_B[a] = child_B[TransIndexB]
                        child_B[TransIndexB] = tempTrans
                        //TransIndexB = TransIndexB-1
                    }

                }
            console.log("after mutation:----------------")
            console.log('A', child_A)
            console.log('B', child_B)
            //save to mongo
            const individual_1 = new Individual({popID: newID + i, array: child_A})
            const individual_2 = new Individual({popID: newID + i + 1, array: child_B})
            console.log("individual_1 ", individual_1)
            console.log("individual_2 ", individual_2)

            for(let n=0; n < individual_1.array.length;n++){
                individual_1.array[n][2]=[]
                individual_2.array[n][2]=[]
            }

            await individual_1.save().then(res => {
                console.log("save 1");
            })
            await individual_2.save().then(res=>{
                console.log("save 2")})

            child_A = []
            child_B = []
            temp = []
        })


    }
}




// אם מוחקים יותר מ4 לשנות את האפדט ID
async function updatePopID(delete_arr) {
    let childrenID_arr = [NUM_POP + 1, NUM_POP + 2, NUM_POP + 3, NUM_POP + 4]
    let sizeDelete = delete_arr.length
    delete_arr.sort((a, b) => a - b).reverse()
    for (let i = 0; i < sizeDelete; ++i) {
        await Individual.findOneAndUpdate({popID: {$in: childrenID_arr}}, {popID: delete_arr[delete_arr.length - 1]}).sort({popID:1})
            .then(response => {
                console.log("update popID successful", response)
            })
            .catch(error => {
                console.log("error update popID")
            })
        delete_arr.pop()
    }
}


//1
async function fitness(popID) {
    console.log("line 207 popID:", popID)
    let individualDoc = await Individual.findOne({popID: popID})
    let max = 0
    console.log("line 178: ",individualDoc);

    for (let i=0;i<individualDoc.array.length;i++){
        if( individualDoc.array[i][0].length > max)
            max=individualDoc.array[i][0].length
    }
    console.log('line 189: max',max)

    let i,num=0;
    for (let j=0; j< max ;j++)//עמודה כמות אנשים
    {
        for (i = 0; i < individualDoc.array.length;i++) //שורה כמות מתקנים
        {
            if(typeof (individualDoc.array[i][0][j])!='undefined') {
                await Enter_To_Attraction1(individualDoc.array[i][1], individualDoc.array[i][0][j], popID, i)
                    .then(response => {
                        console.log('line 59: Enter_To_Attraction1 succeed')
                    })
            }
        }
    }
    let sum = 0
    let d = new Date()
    d.setHours(8,0,0)
    console.log("d",d)
    await User.find().then(
        response =>{
            response.forEach(function(u) {
                sum= sum+(u.time-d)/60000
            });
        })

    console.log("sum", sum)
    console.log("individualDoc.array.length", individualDoc.array.length)
    let avg = sum/individualDoc.array.length
    console.log('line 227: avg',avg)
    await Individual.findOneAndUpdate({popID: popID},{fitness:avg})

    await reset_UserTime().then(response=>{console.log('reset_UserTime in fitness succeed')})

    await resetAttractions().then(response=>{console.log('resetAttractions in fitness succeed')})

    console.log('end fit')
    return avg
}

//2
async function Enter_To_Attraction1(userID,attractionID,popID,i,j) {
    console.log('send UserID: ',userID,'attID',attractionID)
    let count_late = 0;
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
                count_late++
            }
            await Attraction.findOneAndUpdate({attractionID: attractionID}, {$set: {countNow: 1}})// מוסיפים את הבנאדם לסיבוב החדש
            await User.findOneAndUpdate({userID: userID}, {$set: {time: add_minutes(attractionDoc.time, attractionDoc.Round)}}) //לגשת לשדה טיים של היוזר ולהוסיף את הזמן של המתקן
            await Individual.findOneAndUpdate({popID:popID},{$set:{array: individualDoc.array}})
            if(count_late>=3)
                await Individual.findOneAndUpdate({popID:popID},{$push:{LateArray:userID}})
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



// // // // // resets:
// reset_UserTime().then(response=>{console.log('reset_UserTime succeed')})
// resetAttractions().then(response=>{console.log('resetAttractions succeed')})


//
setTimeout(Evolution,3000)

// fitness(1).then(response=>{console.log('fitness')})


//console.log(b.push...(a))