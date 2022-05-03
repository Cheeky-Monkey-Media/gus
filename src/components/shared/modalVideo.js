import PropTypes from 'prop-types'
import React from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Video from "components/shared/video"
import Overlay from "components/shared/overlay"

function ModalVideo(props) {
    console.log(props.videoURL);
    if (props.videoURL) {
        const videoURL = props.videoURL;
        const videoType = (props.videoURL?.includes("youtube") || props.videoURL?.includes("youtu.be") ? `youtube` : `vimeo`);
        const videoID = (videoType === `youtube` ? videoURL?.substr(videoURL?.length - 11) : videoURL?.substr(18));
        return (
        <Overlay>
            <Overlay.ModalButton id={`modal-${videoID}`} className="btn-primary my-4">
                <i className="fa-solid fa-play"></i> Watch Video<span className="visually-hidden">: {props.videoTitle}</span>
            </Overlay.ModalButton>
            <Overlay.Modal id={`modal-${videoID}`}>
                <Video videoID={videoID} videoType={videoType} playerID={`player-${videoID}`} videoTranscript={props.videoTranscript} videoCC={props.videoCC} />
            </Overlay.Modal>
        </Overlay>)
    }
	return null;
}

ModalVideo.propTypes = {
    videoURL: PropTypes.string,
    videoTranscript: PropTypes.string,
    videoCC: PropTypes.string,
    videoWidth: PropTypes.number,
    videoHeight: PropTypes.number,
    videoTitle: PropTypes.string,
}
ModalVideo.defaultProps = {
    videoURL: ``,
    videoTranscript: ``,
    videoCC: ``,
    videoWidth: 16,
    videoHeight: 9,
    videoTitle: `Test`
}

export default ModalVideo