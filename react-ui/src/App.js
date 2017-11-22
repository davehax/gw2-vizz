import React, { Component } from 'react';
import apikey from './api/apikey.js';
import './App.css';

import apiBase from './api/api.js';
import { getJson } from './Util.js';

import Dailies from './Dailies.js';
import Account from './Account.js';
import Characters from './Characters.js';



class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            account: null,
            characters: null,
            dailies: null
        }
    }

    componentDidMount() {
        // Get Account data
        GetAccount()
            .then(function (data) {
                this.setState({
                    account: data
                })
            }.bind(this))
            .catch((error) => {
                console.error(error);
            })

        // Get Characters data
        GetAllCharacters()
            .then(function (data) {
                this.setState({
                    characters: data
                })
            }.bind(this))
            .catch((error) => {
                console.error(error);
            })
        
        // Get Daily Achievements data
        GetDailyAchievements()
            .then(function (data) {
                this.setState({
                    dailies: data
                });
            }.bind(this))
            .catch((error) => {
                console.error(error);
            })
        
    }

    render() {
        return (
            <div className="App">
                <div className="App-body">
                    {this.state.account !== null && <Account account={this.state.account} /> }
                    {this.state.characters !== null && <Characters characters={this.state.characters} />}
                    {this.state.dailies !== null && <Dailies dailies={this.state.dailies} /> }
                </div>
            </div>
        );
    }
}

// Get achievement data from an array of achievement ids
const GetAchievementData = (ids) => {
    ids = ids.join(",");
    return getJson(`${apiBase}/achievements?ids=${ids}`);
}

// Get Account Data. Includes expanded data for World and Guilds
const GetAccount = () => {
    let authKey = "?access_token=" + apikey;

    return new Promise((resolve, reject) => {

        getJson(`${apiBase}/account${authKey}`)
            .then((data) => {

                let promises = [];
                // Get world data
                promises.push(GetWorld(data.world));

                // Get WvW rank data
                promises.push(GetWvWRank(data.wvw_rank));
                
                // Get Guild(s) data                
                data.guilds.forEach((guildId) => {
                    promises.push(GetGuild(guildId));
                });

                Promise.all(promises)
                    .then((values) => {
                        let worldData = values[0]; // first element of the array
                        let wvwData = values[1]; // second element of the array
                        let guildData = values.slice(2); // every element after the second

                        data.world = worldData.name;
                        data.wvw_rank = wvwData.title;
                        data.guilds = guildData;

                        resolve(data);
                    })
                    .catch((error) => {
                        reject(error);
                    });
                
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// Get Daily Achievements
const GetDailyAchievements = () => {
    return new Promise((resolve, reject) => {
        getJson(`${apiBase}/achievements/daily`)
            .then((data) => {

                let ids = [];
                ids.push(data.pve.map((a) => a.id));
                ids.push(data.pvp.map((a) => a.id));
                ids.push(data.wvw.map((a) => a.id));
                ids.push(data.fractals.map((a) => a.id));
                // If there's a seasonal event on
                if (data.special.length) { ids.push(data.special.map((a) => a.id)); }

                // Take a list of achievement ids and get the achievement objects
                GetAchievementData(ids)
                    .then((achievementData) => {
                        // merge achievement data into data returned from dailies endpoint
                        const achievementMerge = (daily) => {
                            let achievement = achievementData.find((a) => { return a.id === daily.id });
                            daily.achievement = achievement;
                        }

                        data.pve.forEach(achievementMerge);
                        data.pvp.forEach(achievementMerge);
                        data.wvw.forEach(achievementMerge);
                        data.fractals.forEach(achievementMerge);
                        data.special.forEach(achievementMerge);

                        resolve(data);
                    });


            }).catch(function (error) {
                reject(error);
            })
    });
}

// Get World - data resolved is { id, name, population }
const GetWorld = (id) => {
    return getJson(`${apiBase}/worlds?id=${id}`);
}

// Get Guild data
const GetGuild = (guildId) => {
    return getJson(`${apiBase}/guild/${guildId}`);
}

// Get WvW Rank Data
const GetWvWRank = (id) => {
    return getJson(`${apiBase}/wvw/ranks/${id}`);
}

// Get Characters data
const GetAllCharacters = () => {
    let authKey = "?access_token=" + apikey;

    // asynchronously launch two requests to the characters and titles endpoints.
    let charactersPromise = getJson(`${apiBase}/characters${authKey}&page=0`);
    let titlesPromise = getJson(`${apiBase}/titles?ids=all`);

    // wrap the requests in Promise.all to further process the data returned.
    return new Promise((resolve, reject) => {
        Promise.all([charactersPromise, titlesPromise])
            // Dark trickery below. Accepting "[ characters, titles ]" as parameters will 
            // create two scoped variables called "characters" and "titles". The value of
            // "characters" is the FIRST [0] index of the array passed in. The value of
            // "titles" is the SECOND [1] index of the array passed in.
            .then(([ characters, titles ]) => {
                // replace the id of character.title with the name of the title
                characters.forEach((character) => {
                    let title = titles.find((t) => t.id === character.title);
                    if (typeof(title) !== "undefined") {
                        character.title = title.name;
                    }
                });

                resolve(characters);
            })
            .catch((error) => { reject(error) });
    })
    
}

export default App;
