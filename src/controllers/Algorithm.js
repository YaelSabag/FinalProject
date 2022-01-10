const person=require('../models/person')

pop_exmp1=[[1,2,3,4,5],[1,2,5,3],[1,4,3,2,5],[1,5,4,3,2]]
pop_exmp2=[[1,4,3,2,5],[1,5,4,3,2],[1,2,3,4,5],[1,2,5,4,3]]




//population is matrix
function fitness(population){

    //attractions  -   [0]-count , [1]-time
    var attraction_1=[0,0]
    var attraction_2=[0,0]
    var attraction_3=[0,0]
    var attraction_4=[0,0]
    var attraction_5=[0,0]
    //persons
    const persons_arr=[8,8,8,8]


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

    console.log(attraction_1)
    console.log(attraction_2)
    console.log(attraction_3)
    console.log(attraction_4)
    console.log(attraction_5)
    console.log(persons_arr)
    console.log('avg:',avg)


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

console.log(fitness(pop_exmp1))
console.log(fitness(pop_exmp2))