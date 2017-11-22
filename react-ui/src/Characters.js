import React from 'react';
import GW2Icon from './GW2Icon.js';
import moment from 'moment';

// Render all characters passed in
const Characters = ({ characters }) => {
    return (
        <div className="characters">
            <h2>Characters</h2>
            {characters.map((character, idx) => <Character key={idx} character={character} />)}
        </div>
    )
}

// Render a single characters details
const Character = ({ character }) => {
    let playtimeHours = Math.floor(character.age / 60 / 60);
    let playtimeMinutes = Math.floor(character.age / 60) % 60;

    let characterCreated = new moment(character.created);
    let now = new moment();
    let ageDuration = moment.duration(now.diff(characterCreated));
    let ageYears = ageDuration.years();
    let ageMonths =  ageDuration.months();
    let ageWeeks = ageDuration.weeks();
    let ageDays = ageDuration.days();

    let age = "";
    if (ageYears > 0) age += `${ageYears} years, `;
    if (ageMonths > 0) age += `${ageMonths} months, `;
    if (ageWeeks > 0) age += `${ageWeeks} weeks, `;
    if (ageDays > 0) age += `${ageDays % 7} days`;

    return (
        <div className="character">
            <h3 className="character-name">
                <GW2Icon iconId={`icon_${character.profession.toLowerCase()}`} />
                &nbsp;<span>{`${character.name} (${character.level})`}</span>
                {typeof(character.title) !== "undefined" ? ( <span className="character-title">&nbsp;{character.title}</span> ) : null}
            </h3>
            <p className="character-crafting">
                {character.crafting.length ? character.crafting.map((craft, idx) => <CraftingDiscipline craft={craft} key={idx} />) : null}
            </p>
            <ul className="character-meta">
                <li>{`Level ${character.level} ${character.race} ${character.profession}`}</li>
                <li>{`Playtime: ${playtimeHours}h ${playtimeMinutes}m`}</li>
                <li>{`Character age: ${age} (Created ${characterCreated.format("D/M/YYYY")})`}</li>
                <li>{`Deaths: ${character.deaths}`}</li>
            </ul>
        </div>
    )
}

// Render a single crafting discipline
const CraftingDiscipline = ({ craft }) => {
    return (
        <span className="character-discipline" data-active={craft.active}>
            <GW2Icon iconId={`map_crafting_${craft.discipline.toLowerCase()}`} />
            <span>{` ${craft.discipline} (${craft.rating})`}</span>
        </span>
    )
}

export default Characters;