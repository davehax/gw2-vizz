import React, { Component } from 'react';

// Loads data for Daily Achievements
class Dailies extends Component {
    render() {
        return (
            <div className="achievements">
                {this.props.dailies.pve.length && (
                    <div className="daily-achievements-group">
                        <h2>PvE Dailies</h2>
                        <DailyDisplay dailies={this.props.dailies.pve} />
                    </div>
                )}

                {this.props.dailies.pvp.length && (
                    <div className="daily-achievements-group">
                        <h2>PvP Dailies</h2>
                        <DailyDisplay dailies={this.props.dailies.pvp} />
                    </div>
                )}

            
                {this.props.dailies.wvw.length && (
                    <div className="daily-achievements-group">
                        <h2>WvW Dailies</h2>
                        <DailyDisplay dailies={this.props.dailies.wvw} />
                    </div>
                )}

                {this.props.dailies.fractals.length && (
                    <div className="daily-achievements-group">
                        <h2>Fractal Dailies</h2>
                        <DailyDisplay dailies={this.props.dailies.fractals} />
                    </div>
                )}

                {this.props.dailies.special.length && (
                    <div className="daily-achievements-group">
                        <h2>Special Dailies</h2>
                        <DailyDisplay dailies={this.props.dailies.special} />
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

export default Dailies;