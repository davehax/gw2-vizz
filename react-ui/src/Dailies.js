import React, { Component } from 'react';

// Loads data for Daily Achievements
class Dailies extends Component {
    render() {
        return (
            <div className="achievements">
                {this.props.dailies.pve.length && (
                    <div className="daily-achievements-group">
                        <h2>PvE Dailies</h2>
                        <DailyGroup dailies={this.props.dailies.pve} />
                    </div>
                )}

                {this.props.dailies.pvp.length && (
                    <div className="daily-achievements-group">
                        <h2>PvP Dailies</h2>
                        <DailyGroup dailies={this.props.dailies.pvp} />
                    </div>
                )}

            
                {this.props.dailies.wvw.length && (
                    <div className="daily-achievements-group">
                        <h2>WvW Dailies</h2>
                        <DailyGroup dailies={this.props.dailies.wvw} />
                    </div>
                )}

                {this.props.dailies.fractals.length && (
                    <div className="daily-achievements-group">
                        <h2>Fractal Dailies</h2>
                        <DailyGroup dailies={this.props.dailies.fractals} />
                    </div>
                )}

                {this.props.dailies.special.length ? (
                    <div className="daily-achievements-group">
                        <h2>Special Dailies</h2>
                        <DailyGroup dailies={this.props.dailies.special} />
                    </div>
                ) : null}

            </div>
        )
    }
}

// class DailyGroup extends Component {
//     constructor(props) {
//         super(props);

//         this.state = {
//             expanded: false
//         }

//         this.dailyOnClick = this.dailyOnClick.bind(this);
//     }

//     dailyOnClick(e) {
//         e.preventDefault();
//         this.setState((prevState) => {
//             return {
//                 expanded: !prevState.expanded
//             }
//         });
//     }

//     render() {
//         let dailies = this.props.dailies;

//         return (
//             <div className="daily-achievements">
//                 {dailies.map((daily, idx) => {
//                     return (
//                         <div className="daily-achievement" key={idx} onClick={this.dailyOnClick}>
//                             <h3 className="daily-name">{daily.achievement.name}</h3>
//                             <div className="daily-details" data-expanded={this.state.expanded}>
//                                 <p className="daily-requirement">{daily.achievement.requirement}</p>
//                                 {daily.achievement.description && <p className="daily-meta">{daily.achievement.description}</p>}
//                             </div>
//                         </div>
//                     )
//                 })}
//             </div>
//         )
//     }
// }

const DailyGroup = ({ dailies }) => {
    return (
        <div className="daily-achievements">
            {dailies.map((daily, idx) => <Daily daily={daily} key={idx} />)}
        </div>
    )
}

class Daily extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: false
        }

        this.dailyOnClick = this.dailyOnClick.bind(this);
    }

    dailyOnClick(e) {
        e.preventDefault();
        this.setState((prevState) => {
            return {
                expanded: !prevState.expanded
            }
        });
    }

    render() {
        return (
            <div className="daily-achievement" onClick={this.dailyOnClick} data-expanded={this.state.expanded}>
                <h3 className="daily-name">{this.props.daily.achievement.name}</h3>
                <div className="daily-details">
                    <p className="daily-requirement">{this.props.daily.achievement.requirement}</p>
                    {this.props.daily.achievement.description && <p className="daily-meta">{this.props.daily.achievement.description}</p>}
                </div>
            </div>
        )
    }
}

export default Dailies;