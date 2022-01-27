


t = new Date().toTimeString()

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



console.log("the fit of population: ",fit1 , fit2 , fit3 , fit4 , fit5 , fit6 )


// מכאן מתחיל לולאת for  }
// Selection- לבחור את ההכי טובים - הכי נמוכים


var fit_arr=[fit1 , fit2 , fit3 , fit4 , fit5 , fit6 ]
fit_arr.sort(function(a, b) {
    return a - b;
});

console.log("sorted fit array: ",fit_arr);
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
//population is matrix
//attractions  -   [0]-count , [1]-time
    var attraction_1=[0,0]
    var attraction_2=[0,0]
    var attraction_3=[0,0]
    var attraction_4=[0,0]
    var attraction_5=[0,0]
//persons
    const persons_arr=[1,1,1,1]

    // max length of array for running
    var len_array=[]
    for( let i=0;i<population.length;i++)
    {
        len_array.push(population[i].length)
    }
    var max_len=Math.max(...len_array);


    for (var j=0; j< max_len ; j++)
    {
        for (var i=0; i< population.length ; i++)
        {
            switch (population[i][j]) {
                case 1:
                    Enter_To_Attraction(i, attraction_1, 1, 3)
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
                    console.log('end of vector '+i)
                    break;

            }

        }
    }

    // calc average waiting time for solution
    var total_time=0
    for(let i=0;i<persons_arr.length ; i++)
        total_time+=persons_arr[i]
    var avg=total_time/persons_arr.length

    // print
    console.log(attraction_1)
    console.log(attraction_2)
    console.log(attraction_3)
    console.log(attraction_4)
    console.log(attraction_5)
    console.log(persons_arr)
    console.log('avg:',avg)

    return avg






//Enter_To_Attraction(i,population[j]) // i: id of user , population[j]:The attraction the user is registered
    function  Enter_To_Attraction( id ,attraction, round,top) {

        if (attraction[0] == 0) {   // count==0
            attraction[0]++
            persons_arr[id] += round
            attraction[1] += round
        }


        else {

            if (persons_arr[id] < attraction[1] && attraction[0] < top) {
                attraction[0]++
                persons_arr[id] += round
                if (attraction[0] == top) {
                    attraction[1] += round
                    attraction[0] = 0
                }
            } else if (persons_arr[id] < attraction[1] && attraction[0] >= top) {
                attraction[1] += round
                attraction[0] = 1
                persons_arr[id] += attraction[1]
            } else { // (persons_arr[id] > Time_A)
                while (persons_arr[id] > attraction[1])
                    attraction[1]+=round
                attraction[0]=0
            }


        }
    }

}















