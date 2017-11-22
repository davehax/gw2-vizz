import React, { Component } from 'react';
import moment from 'moment';
import logo from './img/gw2-logo.jpg';

class Account extends Component {
    render() {
        let commander = this.props.account.commander ? "Yes" : "No";
        let created = new moment(this.props.account.created);
        let now = new moment();
        let accountDuration = moment.duration(now.diff(created));
        let accountAge = Math.floor(accountDuration.asYears()) + " years, " + Math.floor(accountDuration.asMonths() % 12) + " months";

        let access = "Play for free";
        if (this.props.account.access.indexOf("GuildWars2") > -1) access = "Guild Wars 2 (Core)";
        if (this.props.account.access.indexOf("HeartOfThorns") > -1) access += ", Heart of Thorns";
        if (this.props.account.access.indexOf("PathOfFire") > -1) access += ", Path of Fire";

        let guilds = this.props.account.guilds.map((guild) => {
            return `${guild.name} [${guild.tag}]`
        }).join(", ");

        return (
            <div className="account-details">
                <h1 className="account-title">
                    <img src={logo} className="App-logo" alt="Guild Wars 2" />
                    <span>{this.props.account.name}</span>
                </h1>
                <ul className="account-meta">
                    {/* <li><span>Daily AP:</span>{this.props.account.daily_ap}</li> */}
                    {/* <li><span>Monthly AP:</span>{this.props.account.monthly_ap}</li> */}
                    <li><span>World:</span>{this.props.account.world}</li>
                    <li><span>Access:</span>{access}</li>
                    <li><span>Guilds:</span>{guilds}</li>
                    <li><span>Account Age:</span>{accountAge}</li>
                    <li><span>Account Created:</span>{created.format("D/M/YYYY")}</li>
                    <li><span>Commander:</span>{commander}</li>
                    <li><span>WvW Rank:</span>{this.props.account.wvw_rank}</li>
                    {/* <li><span>Fractal Level:</span>{this.props.account.fractal_level}</li> */}
                    
                    
                </ul>
            </div>
        )
    }
}

export default Account;