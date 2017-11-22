import React, { Component } from 'react';
import jsonFetchResponse from './Util.js';
import apiBase from './api/api.js';

let getIconPromise = null;

// Theoretically should return the promise or cached data
// -- currently there's no way it will return the cached data in the window object :'(
const GetIconFiles = () => {
    if (getIconPromise !== null) return getIconPromise;
    
    let cachedData = window.iconCache;

    if (typeof(cachedData) !== "undefined") {
        getIconPromise = new Promise((resolve) => {
            resolve(cachedData);
        });

        return getIconPromise;
    }
    else {
        getIconPromise = new Promise((resolve, reject) => {
            fetch(apiBase + "/files?ids=all", {
                method: "GET",
                headers: new Headers({
                    "Accept": "application/json"
                })
            })
                .then(jsonFetchResponse)
                .then((data) => {
                    window.iconCache = data;
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });

        return getIconPromise;
    }
}

class GW2Icon extends Component {
    constructor(props) {
        super(props);
        this.state = { icon: null };
    }

    componentDidMount() {
        GetIconFiles().then(function(data) {
            let iconUrl = data.find((i) => i.id === this.props.iconId).icon
            this.setState({ 
                icon: iconUrl
            });
        }.bind(this))
        // on fail -- should render instead a generic error
    }

    render() {
        if (this.state.icon !== null) {
            return <img className={"gw2-icon " + this.props.iconId} src={this.state.icon} alt={this.props.iconId} />
        }
        else {
            return null;
        }
    }
}

export default GW2Icon;