import React, { Component } from 'react';
import logo from './img/gw2-logo.jpg';
import apikey from './api/apikey.js';
import './App.css';

import apiBase from './api/api.js';
import jsonFetchResponse from './Util.js';

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
        GetAccount()
            .then(function (data) {
                console.log(data);
                this.setState({
                    account: data
                })
            }.bind(this))
            .catch((error) => {
                console.error(error);
            })

        GetCharacters()
            .then(function (data) {
                console.log(data);
                this.setState({
                    characters: data
                })
            }.bind(this))
            .catch((error) => {
                console.error(error);
            })

        fetch(apiBase + "/achievements/daily", {
            method: 'GET',
            headers: new Headers({
                'Accept': 'application/json'
            })
        }).then(jsonFetchResponse).then(function (data) {

            let ids = [];
            ids.push(data.pve.map((a) => a.id));
            ids.push(data.pvp.map((a) => a.id));
            ids.push(data.wvw.map((a) => a.id));
            ids.push(data.fractals.map((a) => a.id));
            if (data.special.length) { ids.push(data.special.map((a) => a.id)); }

            GetAchievementData(ids)
                .then(function (achievementData) {
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

                    this.setState({
                        dailies: data
                    });
                }.bind(this));


        }.bind(this)).catch(function (error) {
            // Error handling code goes here
            console.error(error)
        })
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="Guild Wars 2" />
                </header>
                <div className="App-body">
                    {this.state.account !== null && <Account account={this.state.account} /> }
                    {this.state.characters !== null && <Characters characters={this.state.characters} />}
                    {this.state.dailies !== null && <Dailies dailies={this.state.dailies} /> }
                </div>
            </div>
        );
    }
}





const Heading = ({ accountName }) => {
    return (
        <h1 className="App-title">{accountName}</h1>
    )
}

const GetAchievementData = (ids) => {
    ids = ids.join(",");

    return new Promise((resolve, reject) => {
        fetch(apiBase + "/achievements?ids=" + ids, {
            method: 'GET',
            headers: new Headers({
                'Accept': 'application/json'
            })
        })
            .then(jsonFetchResponse)
            .then(function (data) {
                resolve(data);
            })
            .catch(function (error) {
                // Error handling code goes here
                reject(error);
            })
    });
}

const GetAccount = () => {
    let authKey = "?access_token=" + apikey;

    return new Promise((resolve, reject) => {
        fetch(apiBase + "/account" + authKey, {
            method: "GET",
            headers: new Headers({
                "Accept": "application/json"
            })
        })
            .then(jsonFetchResponse)
            .then((data) => {

                fetch(apiBase + "/worlds?id=" + data.world, {
                    method: "GET",
                    headers: new Headers({
                        "Accept": "application/json"
                    })
                })
                    .then(jsonFetchResponse)
                    .then((worldData) => {
                        data.world = worldData.name;
                        resolve(data);
                    })

                
            })
            .catch((error) => {
                reject(error);
            });
    });
}

const GetCharacters = () => {
    let authKey = "?access_token=" + apikey;

    // asynchronously launch two requests to the characters and titles endpoints.

    let charactersPromise = new Promise((resolve, reject) => {
        fetch(apiBase + "/characters" + authKey + "&page=0", {
            method: "GET",
            headers: new Headers({
                "Accept": "application/json"
            })
        })
            .then(jsonFetchResponse)
            .then((data) => { resolve(data); })
            .catch((error) => { reject(error); });
    });

    let titlesPromise = new Promise((resolve, reject) => {
        fetch(apiBase + "/titles?ids=all", {
            method: "GET",
            headers: new Headers({
                "Accept": "application/json"
            })
        })
            .then(jsonFetchResponse)
            .then((data) => { resolve(data); })
            .catch((error) => { reject(error); });
    })

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
