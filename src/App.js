import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Modal from './components/Modal';

let domain
if (process.env.NODE_ENV === 'production') {
  domain = 'api.twitch.tv'
} else {
  domain = 'localhost:8010/proxy';

}

function App() {

  const [channels, setChannels] = useState([]);
  const [modal, setModal] = useState(false);
  const [channel, setChannel] = useState({});
  const [search, setSearch] = useState("");
  const client = "exgawhu9wrco7homi5t2n476wbfial";


  const fetchData = async (query) => {
    console.log(process.env.NODE_ENV);
    const res = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${client}&client_secret=9gti728opbgkdj14btryooeos1mxmk&grant_type=client_credentials`)
    const accessToken = res.data.access_token;
    const result = await axios.get(`http://${domain}/helix/search/channels?query=${query}`, {
      headers: {

        "Client-ID": client,
        'Authorization': "Bearer " + accessToken

      }
    })
    let dataArray = result.data.data;
    setChannel(dataArray[0])
    setChannels(dataArray);
  };

  useEffect(() => {


    fetchData("*&first=50");


  }, [])

  const handleToggle = (show, user) => {
    setChannel(user);
    setModal(show);
  }


  const handleChange = (event) => {
    setSearch(event.target.value)
  }

  const handleSearch = (event) => {
    if (event.key === 'Enter' || event.type === 'click') {
      if (search.trim().length === 0) {
        fetchData("*&first=50")
      } else
        fetchData(search);
    }


  }

  const handleRestart = () => {
    setSearch("")
    fetchData("*&first=50");



  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

      </header>
      <div id="custom-search-input">
        <div className="input-group col-md-12">
          <input id="search" type="text" className="form-control input-lg" placeholder="Search for channels" value={search} onChange={(e) => handleChange(e)} onKeyPress={(e) => handleSearch(e)} />
          <span className="input-group-btn">
            <button className="btn btn-lg" type="button" onClick={(event) => handleSearch(event)}>
              <i className="glyphicon glyphicon-search"></i>
            </button>

          </span>
          <span className="input-group-btn">

            <button className="btn btn-lg" type="button" onClick={() => handleRestart()}>
              <i style={{ fontSize: "1.6em", margin: "auto" }} className="glyphicon glyphicon-refresh"></i>
            </button>

          </span>
        </div>
      </div>
      <div className="container fluid">
        <div className="row">
          {channels.map(channel => (
            <div className="col-lg-3 col-md-4 col-sm-6 mt-5" key={channel.id}>
              <div className="card">
                <img className="card-img-top" src={channel.thumbnail_url} alt={channel.display_name} />
                <div className="card-body">
                  <h3 className="card-title">{channel.display_name}</h3>
                  <button style={{ fontSize: "1.2em" }} type="button" className="btn btn-primary" onClick={() => handleToggle(true, channel)}>
                    Show Channel Info
                  </button>


                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal modal={modal} channel={channel} handleToggle={handleToggle}></Modal>
    </div>
  );
}

export default App;

