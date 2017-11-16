import React, { Component } from 'react';
import logo from './img/gw2-logo.jpg';
import apikey from './api/apikey.js';
import './App.css';

// base address for API calls
const apiBase = "https://api.guildwars2.com/v2";

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="Guild Wars 2" />
                    <Heading accountName={"Test"} />
                </header>
                <div className="App-body">
                    <Dailies />
                </div>
            </div>
        );
    }
}

// Loads data for Daily Achievements
class Dailies extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dailies: null
        }
    }

    componentDidMount() {
        GetAccount()
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error(error);
            })

        fetch(apiBase + "/achievements/daily", {
            method: 'GET',
            headers: new Headers({
                'Accept': 'application/json'
            })
        }).then(function (response) {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error('Network response was not ok.');
            }
        }).then(function (data) {

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
            <div>
                {this.state.dailies === null && <div>Loading data</div>}
                {this.state.dailies !== null && this.state.dailies.pve.length && (
                    <div className="daily-achievements-group">
                        <h2>PvE Dailies</h2>
                        <DailyDisplay dailies={this.state.dailies.pve} />
                    </div>
                )}

                {this.state.dailies !== null && this.state.dailies.pvp.length && (
                    <div className="daily-achievements-group">
                        <h2>PvP Dailies</h2>
                        <DailyDisplay dailies={this.state.dailies.pvp} />
                    </div>
                )}

            
                {this.state.dailies !== null && this.state.dailies.wvw.length && (
                    <div className="daily-achievements-group">
                        <h2>WvW Dailies</h2>
                        <DailyDisplay dailies={this.state.dailies.wvw} />
                    </div>
                )}

                {this.state.dailies !== null && this.state.dailies.fractals.length && (
                    <div className="daily-achievements-group">
                        <h2>Fractal Dailies</h2>
                        <DailyDisplay dailies={this.state.dailies.fractals} />
                    </div>
                )}

                {this.state.dailies !== null && this.state.dailies.special.length && (
                    <div className="daily-achievements-group">
                        <h2>Special Dailies</h2>
                        <DailyDisplay dailies={this.state.dailies.special} />
                    </div>
                )}

            </div>
        )
    }
}

const DailyDisplay = ({ dailies }) => {
    return (
        <div className="daily-achievements">
            {dailies.map((daily, idx) => {
                return (
                    <div className="daily-achievement" key={idx}>
                        <h3 className="daily-name">{daily.achievement.name}</h3>
                        {daily.achievement.description && <p className="daily-meta">{daily.achievement.description}</p>}
                        <p className="daily-requirement">{daily.achievement.requirement}</p>
                    </div>
                )
            })}
        </div>
    )
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
    let authKey = "Bearer " + apikey;
    console.log(authKey);

    return new Promise((resolve, reject) => {
        fetch(apiBase + "/account", {
            method: "POST",
            headers: new Headers({
                "Accept": "application/json",
                "Authorization": authKey
            })
        })
            .then(jsonFetchResponse)
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

const jsonFetchResponse = function (response) {
    // debugger;
    if (response.ok) {
        return response.json();
    }
    else {
        // throw new Error('Network response was not ok.');
        throw response;
    }
};

export default App;
