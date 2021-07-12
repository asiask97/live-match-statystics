let parentDivLive = document.querySelector('.currentlyLiveMatches');
const parentDiv = document.querySelector('.remainingMatches');
const containerMatches = document.querySelector('.matchesContainer');
// getting current Monday
function getMonday(today){
    today = new Date();
    let day = today.getDay();
    let dif = today.getDate() - day + (day == 0? -6:1);
    return new Date(today.setDate(dif));
}

let currentMonday = getMonday(new Date());

// functions that add or remove days
Date.prototype.addDays = function(days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
Date.prototype.removeDays = function(days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() - days);
    return date;
}

// converting and displaying dates

//This Week
let thisMonday = currentMonday;
let next6days = thisMonday.addDays(6);

//Last Week
let lastMonday = thisMonday.removeDays(7);
let endOfLastMonday = lastMonday.addDays(6);


//Next Week
let nextMonday = thisMonday.addDays(7);
let endOfNextMonday = nextMonday.addDays(6);


// function that will display required week 

const datePicker = document.querySelector('.datePicker');
const displayDate1 = document.querySelector('.firstDate');
const displayDate2 = document.querySelector('.secondDate');

function displayCorrectDates (start, end){
    displayDate1.textContent = dateFns.format(start, 'D MMM YYYY');;
    displayDate2.textContent = dateFns.format(end, 'D MMM YYYY');;
}


let lastweek= document.getElementById('lastWeek');
let thisweek= document.getElementById('thisWeek');
let nextweek= document.getElementById('nextWeek');
datePicker.addEventListener('click', (e) => {
    //clears display on change of week
    parentDiv.innerHTML = ''

    if(e.target.tagName === 'H4' && e.target.id == 'thisWeek'){
       displayCorrectDates(thisMonday, next6days)
       displayMatches(thisMonday, next6days)
       displayLiveBox(e.target.id)
       addNoMatchesText()
       if (e.target.classList.contains('pickedWeek')){
        
       }else{
            e.target.classList.toggle('pickedWeek')
            nextweek.classList.remove('pickedWeek')
            lastweek.classList.remove('pickedWeek')
       }


    }else if(e.target.tagName === 'H4' && e.target.id == 'lastWeek'){
        displayCorrectDates(lastMonday, endOfLastMonday)
        displayMatches(lastMonday, endOfLastMonday)
        displayLiveBox(e.target.id)
        if (e.target.classList.contains('pickedWeek')){

        }else{
            e.target.classList.toggle('pickedWeek')
            thisweek.classList.remove('pickedWeek')
            nextweek.classList.remove('pickedWeek')
        }


    }else if(e.target.tagName === 'H4' && e.target.id == 'nextWeek'){
        displayCorrectDates(nextMonday, endOfNextMonday)
        displayMatches(nextMonday, endOfNextMonday)
        displayLiveBox(e.target.id)

        if (e.target.classList.contains('pickedWeek')){

        }else{
            e.target.classList.toggle('pickedWeek')
            thisweek.classList.remove('pickedWeek')
            lastweek.classList.remove('pickedWeek')
        }
    }

});

//display the live box 
function displayLiveBox(target){
    if(target === 'nextWeek' || target === 'lastWeek'){
        parentDivLive.classList.add('hidden')
    }else{
        parentDivLive.classList.remove('hidden')
    }
}

// start with current week on display 
displayCorrectDates(thisMonday, next6days);
thisweek.classList.add('pickedWeek');

//displaying correct weeks matches on screen
function displayMatches(from, to){
    let one = dateFns.format(from, 'YYYY-MM-DD');
    let two = dateFns.format(to, 'YYYY-MM-DD');
    fromDate = `date_from=${one}`
    toDate = `date_to=${two}`
    datato_fetch(fromDate, toDate)
}

const apikey = '460e9240-7208-11eb-8756-1f44df7cd0a9';
const premierLeagueSeasonId = 'season_id=352';
function datato_fetch(fromDate,toDate){
    const dataToFetch= `https://app.sportdataapi.com/api/v1/soccer/matches?apikey=${apikey}&${premierLeagueSeasonId}&${fromDate}&${toDate}` 
    fetchData(dataToFetch)
}
//fetching this weeks data to start with
displayMatches(thisMonday, next6days)

// fetching data

function fetchData(dataToFetch){
    fetch(dataToFetch)
    .then((response) => {
        if ( response.ok){
            return response.json();
        }else{
            throw new Error ('fetch goes brrrr');
        }
    })
    .then((jsonData)=>{
        console.log(jsonData);
        manipulatingData(jsonData);
    })
    .catch((err)=>{
        console.log('error', err.message);
    })
}

//change this mess omg
function manipulatingData(data){
    
    let arrayofData = data.data;
    console.log(arrayofData);
    arrayofData.forEach(element => {
        
        let awayTeam = element.away_team.name;
        let homeTeam = element.home_team.name;
        let statusCode = element.status_code;
        let matchId = element.match_id;
        let matchStart = element.match_start;
        let awayScore = element.stats.away_score;
        let homeScore = element.stats.home_score;
        createElement(awayTeam, homeTeam, statusCode, matchId, matchStart, awayScore, homeScore )
    })

}



function createElement(away_team, home_team, status_code, match_id, match_start, away_score, home_score){

    let createDiv= document.createElement('div');
        createDiv.className = match_id;
        createDiv.className = 'match'
       
        //awayscore 
        let awayGoals = document.createElement('h2');
        awayGoals.className = 'awayScore';
        awayGoals.appendChild(document.createTextNode(away_score));
        createDiv.appendChild(awayGoals);
        
        //away team
        let away = document.createElement('h2');
        away.className= 'awayTeam'
        if (away_team.length >= 15 ){
            away.appendChild(document.createTextNode(away_team.slice(0,15)+'..'));
        }else{
            away.appendChild(document.createTextNode(away_team))
        }
        createDiv.appendChild(away);
    
        
        //date in the middle 
        
        let time = match_start.slice(11,-3);
        let day = match_start.slice(8,10);
        let month = match_start.slice(5,7);
        let year = match_start.slice(0,4);
        let newdateformat = `${day}-${month}-${year}`
       
        let date = document.createElement('h5');
        date.className='date';
        if(status_code === 17 ){
            date.appendChild(document.createTextNode(''))
        }else{
            date.appendChild(document.createTextNode(newdateformat))

        }

        let displayTime = document.createElement('h5');
        displayTime.className = 'time';
        if(status_code === 17 ){
            displayTime.appendChild(document.createTextNode('Date & Time To Be Announced'))

        }else{
            displayTime.appendChild(document.createTextNode(time));
        }
        displayTime.appendChild(date);
        createDiv.appendChild(displayTime);


        // thing separating score
        let displaydots = document.createElement('h5');
        displaydots.className = 'dots';
        displaydots.appendChild(document.createTextNode(":"));
        createDiv.appendChild(displaydots);


        //homescore

        let homeGoal = document.createElement('h2');
        homeGoal.className = 'homeScore';
        homeGoal.appendChild(document.createTextNode(home_score));
        createDiv.appendChild(homeGoal);

        //home team 
        let home = document.createElement('h2');
        home.className = 'homeTeam';
        if (home_team.length >= 15 ){
            home.appendChild(document.createTextNode(home_team.slice(0,15)+'..'));
        }else{
            home.appendChild(document.createTextNode(home_team))
        }
        createDiv.appendChild(home);
       
        // chaecking if live 
        if(status_code === 1 || status_code === 11|| status_code === 12){
            
            parentDivLive.appendChild(createDiv);
            if (parentDivLive.contains(document.getElementById('nomatches'))){
                document.getElementById('nomatches').remove();
            }
            homeGoal.remove();
            awayGoals.remove();
            displaydots.remove();
            date.remove()
            displayTime.innerHTML = 'Click for <br> MORE'


        }else{
            parentDiv.appendChild(createDiv);
        }


}

//removing There is currntly no matches text
function addNoMatchesText(){
    let nomatches = document.getElementById('nomatches');
    let match = document.querySelector('.match');

    if (!parentDivLive.contains(nomatches) && !parentDivLive.contains(match) ){
        let text = document.createElement('h6');
        text.className = 'noMatches';
        text.id = 'nomatches';
        textnode = document.createTextNode('There are currently no live matches available');
        text.appendChild(textnode);
        parentDivLive.appendChild(text)
    }
}

//if clicked on a match it moves to a page with correct data displayed

// hamburger with night mode && one other leage

// make it only add matches once

// tryingout new api base linked with database 
//getting access tocken
let myHeaders = new Headers();
myHeaders.append("Authorization", "Basic NzM4MGNtOXA3Zm1uMHJ0ZTJlbXBmZmk3MzM6MXZrZmtzOTFxcG42b2cwZjlxb2wzczA3azVuNzRkbmRicnVxM3Q2a2NlMTFvM2dicHRmbw==");
myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
myHeaders.append("Cookie", "XSRF-TOKEN=8fa05c58-bcb3-4fce-bdab-e367ede6c9bb");

let urlencoded = new URLSearchParams();
urlencoded.append("grant_type", "client_credentials");

let requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow'
};

fetch('https://oauth2.elenasport.io/oauth2/token', requestOptions)
    .then( response => {
        if(response.ok){
            return response.json();
        }else{
            throw new Error('api goes brrr');
        }
    })
    .then(token => {
        let accessToken = token.access_token;
        fetchingData(accessToken);
        console.log(accessToken)
    })
    .catch( err => {
        console.log('error:', err.message);
    });

//using access tocken


function fetchingData (token){
    
    const myHeaders = {
        "content-type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${token}`,

    };

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch('https://football.elenasport.io/v2/leagues/:234', requestOptions)
       .then( response => {
            if(response.ok){
                return response.json();
            }else{
                throw new Error('api goes brrr');
            }
        })
        .then(data => {
            console.log(data);
            
        })
        .catch( err => {
            console.log('error:', err.message);
        });


}
