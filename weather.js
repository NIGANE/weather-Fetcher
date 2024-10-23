#!/usr/bin/env node


import chalk  from 'chalk'
import chalkAnimation from 'chalk-animation'
import axios from 'axios';
import inquirer  from 'inquirer';
import figlet from 'figlet'
import nanospinner, { createSpinner } from 'nanospinner'
import cityNames from './cityNames.json'assert { type: 'json' };
require('dotenv').config();



const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;
const noWhere = 'No Where'
let cityName ;
let unit = 'metric' ;


const sleep = (ms = 2000 )=> new Promise((r)=>setTimeout(r,ms));

function inArray(needle,haystack)
{
    var count=haystack.length;
    for(var i=0;i<count;i++)
    {
        if(haystack[i].toLowerCase() ===needle.toLowerCase()){return true;}
    }
    return false;
}


const welcome = async() => {
    const pre = chalkAnimation.rainbow('Lanching The App...\n')
    await sleep();
    pre.stop();
    const title = `Wheather` ;
     await figlet(title,(err,data)=>{
        console.log(data)
    })
    console.log(chalk.bgBlueBright('Welcome To Weather CLI App'));
    
    console.log(`
        ${chalk.white.bgYellow.bold('DESCRIPTION : ')} 
        We Help Get Weather From A Giving City Name From The User
        By Fetching Some Weather Api's.
        `);
    await getCityName();
    await getUnit();
    const data  = await getWeather(cityName,unit);
    await show(data);

}

const getCityName =async () => {
    let count = 3 ;

    while(count > 0  ){
        
        const answers =await inquirer.prompt({
            name:'city',
            type:'input',
            message:chalk.inverse.black('Enter Spicific City Name : '),
            defult(){
                return noWhere ;
            }
          
        })
        cityName =  answers.city.charAt(0).toUpperCase()+answers.city.slice(1);
        const spinner = createSpinner('Looking For The Giving Input '+cityName).start();
        await sleep();
        
        
        if( cityName === noWhere || !inArray(cityName,cityNames)) {
            
            spinner.error({
                text:'City Nout Found'
            });
            console.log('Please Try Again')
            count--;
    
        }else{
            spinner.success({
                text:'founded. '
            });
            break;
        }
    }
    if(count === 0 ){
        console.log('out of Tries MYB Later.');
        process.exit(1);
    }
    return cityName;

}

const getUnit = async ()=>{
    const answers = await inquirer.prompt({
        name:'unit',
        type:'list',
        message:chalk.inverse.black('Choose The Unit : '),
        choices:[
            'C',
            'F'
        ],
        default(){
            return 'C';
        }
    })
    const spinner = createSpinner(`using ${answers.unit} Unit`).start();
    await sleep(100);
    (answers.unit === 'F' ? unit = 'imperial': unit);
    spinner.success();
    return unit
}

const getWeather = async (city,uni)=> {
    
    const params = {
        q:city,
        appid:API_KEY,
        units:uni
    }
    try{
        const res = await axios.get(BASE_URL,{params:params});
        let data = res.data
        return data;
    }catch(err){
        console.log(err)
    }
}
function time(duration) {
    let milliseconds = Math.floor((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    // Pad the values with leading zeros if needed
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}



const show = (data)=> {
    const weather = {
        city: data.name,
        temperature: data.main.temp,
        description: data.weather[0].description,
        humidity:   data.main.humidity,
        wind:data.wind.speed,
    }

    console.log(`
        +---------------------+---------------------+---------------------+---------------------+---------------------+
        |        city         |     temperature     |       humidity      |        wind         |   description         
        +---------------------+---------------------+---------------------+---------------------+---------------------+
        `.toUpperCase());

    console.log(`
        +---------------------+---------------------+---------------------+---------------------+---------------------+
        |${weather.city}${' '.repeat(21-weather.city.length)}|${weather.temperature}${' '.repeat(21-weather.temperature.toString().length)}|${weather.humidity}${' '.repeat(21-weather.humidity.toString().length)}|${weather.wind}${' '.repeat(21-weather.wind.toString().length)}|${weather.description}
        +---------------------+---------------------+---------------------+---------------------+---------------------+
            `.toUpperCase());



}
await welcome()



