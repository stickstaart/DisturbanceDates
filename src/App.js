import * as React from 'react';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider
} from '@mui/material';
import pastShows from './dates';
import Flag from 'react-world-flags';
import { useState } from 'react';

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [dates, setDates] = useState(pastShows);
  const [showHistory, setShowHistory] = useState(false);

  const handleSelectedCountry = (selectedCountry) => {
    setSelectedCountry(selectedCountry);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="master-container">
      <ConcertFilter
        dates={dates}
        selectedCountry={selectedCountry}
        className="concert-filter"
        onCountrySelectedChange={handleSelectedCountry}
      />
      <Button onClick={toggleHistory}>
        {showHistory ? 'HIDE HISTORY' : 'SHOW HISTORY'}
      </Button>
      <Concerts
        dates={dates}
        selectedCountry={selectedCountry}
        showHistory={showHistory}
      />
    </div>
  );
}

const ConcertFilter = ({ dates, selectedCountry, onCountrySelectedChange }) => {
  return (
    <div>
      <h3>🔍 FILTER :: FILTER :: FILTER 🔎</h3>
      <p>Current country selected: 🌏 {selectedCountry === 'ALL' ? 'ALL' : selectedCountry} 🌏</p>
      <CountriesPlayed dates={dates} onCountrySelectedChange={onCountrySelectedChange} />
    </div>
  );
};

const CountriesPlayed = ({ dates, onCountrySelectedChange }) => {
  const countriesPlayed = Array.from(new Set(dates.map((date) => date.country)));

  const handleChange = (event) => {
    onCountrySelectedChange(event.target.value);
  };

  return (
    <select onChange={handleChange}>
      <option value="ALL">ALL</option>
      {countriesPlayed.map((country) => (
        <option key={country} value={country}>
          {country}
        </option>
      ))}
    </select>
  );
};

const Concerts = ({ dates, selectedCountry, showHistory }) => {
  const now = new Date();

  const filteredDates = selectedCountry === 'ALL'
    ? dates
    : dates.filter(date => date.country === selectedCountry);

  // Separate future and past concerts
  const futureDates = filteredDates.filter(date => new Date(parseDate(date.date)) >= now);
  const pastDates = filteredDates.filter(date => new Date(parseDate(date.date)) < now);

  return (
    <>
      <ul className="dates">
        {futureDates.map((date, index) => (
          <ConcertItem dateObj={date} key={index} />
        ))}
      </ul>
      {showHistory && (
        <ul className="dates history">
          {pastDates.map((date, index) => (
            <ConcertItem dateObj={date} key={index} />
          ))}
        </ul>
      )}
    </>
  );
};

const ConcertItem = ({ dateObj }) => {
  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 940,
        bgColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
      className={'concert-item-container'}
    >
      <Divider />
      <ListItem className={'concert-item'}>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: 'white' }}>
            <Flag
              code={dateObj.country}
              fallback={null}
              sx={{ height: '100%', width: 'auto' }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={`${dateObj.city} - ${dateObj.venue}`}
          secondary={dateObj.date}
          className="text-amber-600 bg-gray-500 !important"
        />
      </ListItem>
      <Divider />
    </List>
  );
};

// Function to handle date parsing
const parseDate = (dateString) => {
  const [day, month, year] = dateString.split('-');

  // Handle cases where day or month is unknown (??)
  const parsedDay = day === '??' ? '01' : day;
  const parsedMonth = month === '??' ? '01' : month;

  // Construct the date string as yyyy-mm-dd
  return new Date(`${year}-${parsedMonth}-${parsedDay}`);
};
