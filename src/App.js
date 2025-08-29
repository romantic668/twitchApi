import './App.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Modal from './components/Modal';
import logo from './logo.svg';

function App() {
  const [channels, setChannels] = useState([]);
  const [modal, setModal] = useState(false);
  const [channel, setChannel] = useState({});
  const [search, setSearch] = useState('');

  // Twitch 的 thumbnail_url 模板会带 {width}x{height}
  const resolveThumb = (tpl, w = 320, h = 180) => {
    if (!tpl || typeof tpl !== 'string') return '';
    return tpl.replace('{width}', String(w)).replace('{height}', String(h));
  };

  // 直接调你自己的后端；后端会注入 Client-Id/Bearer 并转发到 Helix
  const fetchData = async (query) => {
    try {
      const params = new URLSearchParams();
      params.set('query', query && query.length ? query : 'a'); // query 必填，默认 'a'
      params.set('first', '50');

      const { data } = await axios.get(`/api/search-channels?${params.toString()}`);
      const dataArray = data?.data || [];
      setChannel(dataArray[0] || {});
      setChannels(dataArray);
    } catch (e) {
      console.error('fetchData error:', e?.message || e);
    }
  };

  useEffect(() => {
    // 默认拉一批：等价于搜 'a'
    fetchData('');
  }, []);

  const handleToggle = (show, user) => {
    setChannel(user);
    setModal(show);
  };

  const handleChange = (event) => setSearch(event.target.value);

  const handleSearch = (event) => {
    if (event.key === 'Enter' || event.type === 'click') {
      fetchData(search.trim());
    }
  };

  const handleRestart = () => {
    setSearch('');
    fetchData('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>

      <div id="custom-search-input">
        <div className="input-group col-md-12">
          <input
            id="search"
            type="text"
            className="form-control input-lg"
            placeholder="Search for channels"
            value={search}
            onChange={handleChange}
            onKeyPress={handleSearch}
          />
          <span className="input-group-btn">
            <button className="btn btn-lg" type="button" onClick={handleSearch}>
              <i className="glyphicon glyphicon-search"></i>
            </button>
          </span>
          <span className="input-group-btn">
            <button className="btn btn-lg" type="button" onClick={handleRestart}>
              <i style={{ fontSize: '1.6em', margin: 'auto' }} className="glyphicon glyphicon-refresh"></i>
            </button>
          </span>
        </div>
      </div>

      <div className="container fluid">
        <div className="row">
          {channels.map((ch) => (
            <div className="col-lg-3 col-md-4 col-sm-6 mt-5" key={ch.id || ch.broadcaster_login}>
              <div className="card">
                <img
                  className="card-img-top"
                  src={resolveThumb(ch.thumbnail_url)}
                  alt={ch.display_name || ch.broadcaster_login}
                />
                <div className="card-body">
                  <h3 className="card-title">{ch.display_name || ch.broadcaster_login}</h3>
                  <button
                    style={{ fontSize: '1.2em' }}
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleToggle(true, ch)}
                  >
                    Show Channel Info
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal modal={modal} channel={channel} handleToggle={handleToggle} />
    </div>
  );
}

export default App;
