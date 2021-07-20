import PropTypes from 'prop-types';
import React from 'react';
import '../styles/button-widget.css'
import CallToAction from '../components/callToAction';
import { Link } from 'gatsby';
import { contentExists } from '../utils/ug-utils';
import { trackCustomEvent } from 'gatsby-plugin-google-analytics';


function ButtonStyle (styleOfButton){
    switch(styleOfButton){
        case 'Primary':
            return 'btn-primary';
        case 'Primary (Outline)':
            return 'btn-outline-primary';
        case 'Secondary':
            return 'btn-secondary';
        case 'Secondary (Outline)':
            return 'btn-outline-secondary';
        case 'Info':
            return 'btn-info';
        case 'Info (Outline)':
            return 'btn-outline-info'
        default:
            return 'btn-primary';
    }
}

function FontAwesomeIconColour (colourChoice) {
    switch(colourChoice) {
        case 'Yellow':
            return 'yellow-icon';
        case 'Red':
            return 'red-icon';
        case 'Darker Red':
            return 'red-darker-icon)';
        default: 
            return '';
    }
}

function Button (buttonData, buttonClass, buttonFAIconAdjust, buttonTextClass){
    const aliasData = require('../../config/aliases/aliasfile.yml');

// set the link to the url provided, if internal Drupal link (entity or internal) - clean up the URI to work with Link command,
// to handel a <noLink>, if external link pass through, otherwise set to null
	const urlLink = (contentExists(buttonData.field_button_link.uri)) ? (buttonData.field_button_link.uri.includes("entity:node/")) ? 
		aliasData[buttonData.field_button_link.uri.replace("entity:node/","")]: (buttonData.field_button_link.uri.includes("internal:/")) ? ("/") : (
            buttonData.field_button_link.uri.includes("<nolink>")) ? null : buttonData.field_button_link.uri :null; 

    let buttonLinkTitle = contentExists(buttonData.field_formatted_title)? buttonData.field_formatted_title.processed:
        contentExists(buttonData.field_button_link.title)? buttonData.field_button_link.title: "no title entered";    
    let btnClassName = (contentExists(buttonClass))? buttonClass: '' ;                                          
    let buttonClassName= 'btn ' + ButtonStyle(buttonData.relationships.field_button_style.name) + ' ' + btnClassName;
    let btnFAIconAdjust = (contentExists(buttonFAIconAdjust))? buttonFAIconAdjust: '';
    let buttonFontAwesomeClassName = contentExists(buttonData.field_font_awesome_icon)? buttonData.field_font_awesome_icon + ' ' +
                                btnFAIconAdjust + ' fa-fw '+ FontAwesomeIconColour(buttonData.relationships.field_font_awesome_icon_colour.name):'';
    let buttonTextClassName = contentExists(buttonTextClass)? buttonTextClass: '';
	
	let btnAnalyticsGoal = (contentExists(buttonData.relationships.field_cta_analytics_goal) ? buttonData.relationships.field_cta_analytics_goal.name : ``);
	let btnAnalyticsAction = (contentExists(buttonData.relationships.field_cta_analytics_goal) ? buttonData.relationships.field_cta_analytics_goal.field_goal_action : ``);

    return (
	<React.Fragment key={buttonData.drupal_id}>
    {contentExists(buttonData.field_cta_heading)? 
        <span dangerouslySetInnerHTML={{__html: "<p>" + buttonData.field_cta_heading.processed + "</p>"}} /> : ``}
	
    {(buttonData.field_button_link.uri.includes("http"))? contentExists(btnAnalyticsGoal) && contentExists(btnAnalyticsAction) ? 
		<a href={urlLink} className={buttonClassName} onClick={e => {trackCustomEvent({category: btnAnalyticsGoal,action: btnAnalyticsAction,})}}>		
            <i aria-hidden="true" className={buttonFontAwesomeClassName} > </i>
            <span className={buttonTextClassName} dangerouslySetInnerHTML={{__html: buttonLinkTitle}} />
        </a>
		:
		<a href={urlLink} className={buttonClassName}>		
            <i aria-hidden="true" className={buttonFontAwesomeClassName} > </i>
            <span className={buttonTextClassName} dangerouslySetInnerHTML={{__html: buttonLinkTitle}} />
        </a>
        :
        contentExists(btnAnalyticsGoal) && contentExists(btnAnalyticsAction) ? 
		<Link to={urlLink} className={buttonClassName} onClick={e => {trackCustomEvent({category: btnAnalyticsGoal,action: btnAnalyticsAction,})}}>		
            <i aria-hidden="true" className={buttonFontAwesomeClassName} > </i>
            <span className={buttonTextClassName} dangerouslySetInnerHTML={{__html: buttonLinkTitle}} />
        </Link>
		:
		<Link to={urlLink} className={buttonClassName}>		
            <i aria-hidden="true" className={buttonFontAwesomeClassName} > </i>
            <span className={buttonTextClassName} dangerouslySetInnerHTML={{__html: buttonLinkTitle}} />
        </Link>
        
	}
    </React.Fragment>)
}
Button.propTypes = {
    buttonData: PropTypes.object,
    buttonClass:  PropTypes.string, 
    buttonFAIconAdjust: PropTypes.string,
    buttonTextClass: PropTypes.string,
}

Button.defaultProps = {
    buttonData: '',
    buttonClass: '',
    buttonFAIconAdjust: '',
    buttonTextClass: '',
}
export default Button