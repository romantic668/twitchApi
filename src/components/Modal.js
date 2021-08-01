import React from 'react'
import live from '../live.png'

function Modal(props) {

    return (
        <div style={props.modal ? { display: 'block', opacity: 1 } : { display: 'none', opacity: 1 }} className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div style={{ fontSize: "2em" }} className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2 className="modal-title" id="exampleModalLongTitle">{props.channel.display_name}</h2>
                        <button onClick={() => props.handleToggle(false, props.channel)} style={{ fontSize: "1.5em" }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true" >&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div>
                            <img src={props.channel.thumbnail_url} alt={props.channel.display_name} />
                            <div className="card-body">
                                <h2 className="card-title">Title: {props.channel.title}</h2>

                                <p className="card-text">Game Name: {props.channel.game_name}</p>
                                <p className="card-text">Language: {props.channel.broadcaster_language}</p>
                                {props.channel.is_live ? <img src={live} alt="live" style={{ width: "80px", height: "auto" }} /> : <p className="card-text">Offline</p>}

                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button style={{ fontSize: "0.7em" }} id="closeButton" onClick={() => props.handleToggle(false, props.channel)} type="button" className="btn btn-lg btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}





export default Modal
