import React from 'react';
import Layout from '../components/layout';
import { Helmet } from 'react-helmet';
import SEO from '../components/seo';
import Hero from '../components/hero';
import Breadcrumbs from '../components/breadcrumbs';
import RelatedPages from '../components/relatedPages';
import LinksItems from '../components/linksItems';
import LinksWidget from '../components/linksWidget';
import CtaPara from '../components/ctaPara';
import LeadPara from '../components/leadPara';
import { graphql } from 'gatsby';

export default ({data}) => {

	const pageData = data.pages.edges[0].node;
	const nodeID = pageData.drupal_internal__nid;	
	const title = pageData.title;
	const body = (pageData.body !== null ? pageData.body.processed:``);
	const imageData = data.images.edges;
	let relatedPageData;
	var linksData;
	var ctaParaData;
	
	if (pageData.relationships.field_related_content !== undefined) { relatedPageData = pageData.relationships.field_related_content; }
	if (pageData.relationships.field_widgets !== undefined) { linksData = pageData.relationships.field_widgets; }
    if (pageData.relationships.field_widgets !== undefined) { ctaParaData = pageData.relationships.field_widgets; }

	return (
		<Layout>
			<Helmet bodyAttributes={{
				class: 'basic-page'
			}}
			/>
			<SEO title={title} keywords={[`gatsby`, `application`, `react`]} />
			
			{ /**** Header and Title ****/ }
			<div id="rotator">
				<Hero imgData={imageData} />				
				<div className="container ft-container">
					<h1 className="fancy-title">{title}</h1>
				</div>
			</div>
			
			<Breadcrumbs nodeID={nodeID} nodeTitle={title} />
			
			{ /**** Body content ****/ }
			<div className="container page-container">
				<div className="row row-with-vspace site-content">
					<section className="col-md-9 content-area">
						<LeadPara pageData={ctaParaData} />
						<div dangerouslySetInnerHTML={{ __html: body}} />

						<RelatedPages pageData={relatedPageData} displayType={'list'} />
						<CtaPara pageData={ctaParaData} />
						
					</section>
				</div>
			</div>	
			{ /**** Links Items conent ****/}
			<LinksWidget pageData={pageData} heading={"Grid"} displayType={'grid'} headingLevel={'h2'} numColumns={4}/>		
			<LinksItems pageData={linksData} heading={"List"} displayType={'list'} headingLevel={'h2'} numColumns={1}/>	
			<LinksItems pageData={linksData} heading={"Small Grid"} displayType={'small-grid'} headingLevel={'h2'} numColumns={2}/>	
		</Layout>
	)
	
}

//export default BasicPage

export const query = graphql`
  query ($id: String) {
	pages: allNodePage(filter: {id: {eq: $id}}) {
	  edges {
		node {
		  drupal_id
		  drupal_internal__nid
		  title
		  body {
			processed
		  }
		  relationships {
			field_related_content {
			  drupal_id
			  relationships {
			    field_list_pages {
				  ... on node__page {
					drupal_id
					id
					title
					fields {
					  alias {
						value
					  }
					}
				  }
			    }
			  }
			}
			field_widgets {
				__typename
					... on paragraph__call_to_action {
						id
						field_cta_title
						field_cta_description
						field_cta_primary_link {
					  		title
					  		uri
						}
					}
					... on paragraph__lead_paragraph {
             					id
              					field_lead_paratext {
                					value
              					}
            				}	
					... on paragraph__links_items {
						drupal_id
						field_link_description
						field_link_url {
							title
							uri
							}
							relationships {
								field_link_image {
									relationships {
										field_media_image {
											localFile {
												publicURL
												childImageSharp {
													resize(width: 400, height: 300, cropFocus: CENTER) {
													src
													}
												}
											}
										}
									}
								}
							}
						}
					... on paragraph__links_widget {
						drupal_id
						field_link_items_title
						field_link_items_description
						relationships {
							field_link_items {
								drupal_id
								field_link_description
								field_link_url {
									title
									uri
									}
									relationships {
										field_link_image {
											relationships {
												field_media_image {
													localFile {
														publicURL
														childImageSharp {
															resize(width: 400, height: 300, cropFocus: CENTER) {
															src
															}
														}
													}
												}
											}
										}
									}
							}
						}

					}
				}
			field_tags {
			  __typename
				... on TaxonomyInterface {
				name
			  }
			}
		  }
		}
	  }
	}
	images: allMediaImage(filter: {relationships: {node__page: {elemMatch: {id: {eq: $id}}}}}) {
      edges {
        node {
		  drupal_id
		  field_media_image {
			alt
		  }
		  relationships {
			field_media_image {
			  localFile {
				childImageSharp {
				  fluid(maxWidth: 1920) {
					originalImg
					...GatsbyImageSharpFluid
				  }
				}
			  }
			}
			field_tags {
			  __typename
			  ... on TaxonomyInterface {
				name
			  }
            }
          }
        }
      }
    }
  }
`