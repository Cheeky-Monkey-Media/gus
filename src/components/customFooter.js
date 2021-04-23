import PropTypes from 'prop-types';
import React from 'react';
import { GatsbyImage } from "gatsby-plugin-image";
import Widgets from './widgets';
import { contentExists } from '../utils/ug-utils';
import '../styles/customFooter.css';

function CustomFooter (props) {
	
	const footer = props.footerData;
	const footerLogos = (contentExists(footer.node.relationships.field_footer_logo) ? footer.node.relationships.field_footer_logo : null);
	const footerText = (contentExists(footer.node.body.processed) ? footer.node.body.processed : null);
	const footerWidgets = (contentExists(footer.node.relationships.field_widgets) ? footer.node.relationships.field_widgets : null);
		
	return <>	
		<div className="full-width-container bg-light pre-footer">
			<div className="container page-container">
				<section className="row row-with-vspace site-content">
					{contentExists(footerLogos) &&
					<div className="col-md-3 content-area">
					{footerLogos.map(logo => (
						<GatsbyImage
                            image={logo.relationships.field_media_image.localFile.childImageSharp.gatsbyImageData}
                            className="footer-logo"
                            alt={logo.field_media_image.alt} />
					))}
					</div>}
					<div className="col-md-9 content-area">
						<div className="container" dangerouslySetInnerHTML={{ __html: footerText}} />
						<Widgets pageData={footerWidgets} />
					</div>
				</section>			
			</div>
		</div>
	</>;
}
		
CustomFooter.propTypes = {
    footerData: PropTypes.object,
}
CustomFooter.defaultProps = {
    footerData: null,
}

export default CustomFooter