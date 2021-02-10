﻿/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

/* Example of a complex content type that:

  - References multiple vocabularies
    - "tags" (String) under fields provides context for the page query
    - "field_tags" under relationships points to the vocabularies (union)
  - Includes an image
    - "field_image" provides alt text
    - "field_image" under relationships links to the actual image
  - Has a path alias generated by Gatsby
     - "alias" under fields maps the generated alias to the query

  OTHER Instructions
  - For the path alias, you will also need to:
    - Add "node__contenttype.fields.alias": `PathAlias`, to the mapping in gatsby-config.js
    - Update exports.onCreateNode
  - Use THREE underscores when referencing nodes that do not exist yet (i.e. ___NODE)

  Excellent Reading Material:
  https://www.jamesdflynn.com/development/gatsbyjs-drupal-create-custom-graphql-schema-empty-fields
   
  SAMPLE SCHEMA
  Note: for taxonomy, you would use 
  ```type taxonomy_term__vocabularyname implements Node & TaxonomyInterface```
  ---

    type node__contenttype implements Node {
      body: BodyFieldWithSummary
      changed: Date @dateformat
      drupal_id: String
      drupal_internal__nid: Int
      field_image: ImageField
      fields: node__contenttypeFields   // Note - you could also point to FieldsPathAlias instead of node__contenttypeFields if it's just an alias that you need
      relationships: node__contenttypeRelationships
      title: String
    }
    type node__contenttypeRelationships implements Node {
      field_image: file__file @link(from: "field_image___NODE")
      field_tags: [relatedTaxonomyUnion] @link(from: "field_tags___NODE")
    }
    type node__contenttypeFields implements Node {
      alias: PathAlias @link
      tags: [String]
    }

# Deprecation Warnings
See https://www.gatsbyjs.com/blog/2019-05-17-improvements-to-schema-customization/#migrating-your-code

After adding a new field to the schema, you may see the following:
```warn Deprecation warning - adding inferred resolver for <field name>```

In this case, you'll want to add one of 3 inferred resolvers to your field schema:
- @dateformat (for dates)
- @link (for things like taxonomy fields, images, etc. - typically you'll need a from value for this as well)
- @fileByRelativePath

For example:

changed: Date @dateformat
field_name: [taxonomy_term__vocabulary_name] @link(from: "field_name___NODE")

**/

const path = require(`path`)
const fs = require('fs');
const yaml = require('js-yaml');
const util = require('util');

exports.createSchemaCustomization = ({ actions }) => {
	const { createTypes } = actions

	const typeDefs = `
	
	interface TaxonomyInterface @nodeInterface {
      id: ID!
      drupal_id: String
      name: String
    }
	interface WidgetParagraphInterface @nodeInterface {
      id: ID!
      drupal_id: String
    }

	union media__imagemedia__remote_videoUnion =
	  media__image
	  | media__remote_video
	  
	union relatedParagraphUnion = 
	  paragraph__program_variants
	  | paragraph__general_text

	union relatedTaxonomyUnion =
	  taxonomy_term__tags
	  | taxonomy_term__specializations
	  | taxonomy_term__programs
	  | taxonomy_term__degrees
	  | taxonomy_term__topics
	  | taxonomy_term__units
    | taxonomy_term__testimonial_type

	union widgetParagraphUnion =
      paragraph__link_item
      | paragraph__links_items
      | paragraph__call_to_action
	  | paragraph__lead_paragraph
      | paragraph__links_widget
	  | paragraph__media_text
	  | paragraph__section


    union widgetSectionParagraphUnion =
	  paragraph__link_item
	  | paragraph__links_items
	  | paragraph__call_to_action
	  | paragraph__lead_paragraph
	  | paragraph__links_widget
	  | paragraph__media_text

	type BodyField {
      processed: String
      value: String
      format: String
      summary: String
    }
    type BodyFieldWithSummary {
      processed: String
      value: String
      format: String
      summary: String
    }
	
	type FieldLink {
      title: String
      uri: String
    }
	type FieldsPathAlias {
      alias: PathAlias @link
    }
	
	type ImageField implements Node {
      alt: String
    }
	
	type InstaNode implements Node {
      original: String
      caption: String
    }

	type media__image implements Node {
      drupal_id: String
      name: String
      field_media_image: ImageField
      fields: media__imageFields
      relationships: media__imageRelationships
    }
    type media__imageFields implements Node {
      tags: [String]
    }
    type media__imageRelationships implements Node {
      field_media_image: file__file @link(from: "field_media_image___NODE")
      field_tags: [relatedTaxonomyUnion] @link(from: "field_tags___NODE")
    }
	type media__remote_video implements Node {
	  name: String
	  field_media_oembed_video: String
	  relationships: media__remote_videoRelationships
	}
	type media__remote_videoRelationships implements Node {
	  field_media_file: file__file @link(from: "field_media_file___NODE")
	}
	
	type MenuItems implements Node {
	  parent: Node
	  enabled: Boolean
	  menu_name: String
	  route: MenuItemsRoute
	  title: String
	  description: String
	  url: String
	  weight: Int
	  childrenMenuItems: [MenuItems]
	}
	type MenuItemsRoute implements Node {
	  name: String
	  parameters: MenuItemsRouteParameters
	}
	type MenuItemsRouteParameters implements Node {
	  node: String
	}
	
	type node__article implements Node {
      changed: Date @dateformat
      created: Date @dateformat
      drupal_id: String
      drupal_internal__nid: Int
      title: String
      body: BodyFieldWithSummary
      field_hero_image: ImageField
      relationships: node__articleRelationships
      fields: node__articleFields
    }
    type node__articleRelationships implements Node {
      field_hero_image: media__image @link(from: "field_hero_image___NODE")
      field_news_category: [taxonomy_term__news_category] @link(from: "field_news_category___NODE")
      field_tags: [relatedTaxonomyUnion] @link(from: "field_tags___NODE")
    }
    type node__articleFields implements Node {
      alias: PathAlias @link
      tags: [String]
    }
    type node__call_to_action implements Node {
      drupal_id: String
      drupal_internal__nid: Int
      title: String
      field_call_to_action_link: FieldLink
      relationships: node__call_to_actionRelationships
      fields: node__call_to_actionFields
    }
    type node__call_to_actionFields implements Node {
      tags: [String]
    }
    type node__call_to_actionRelationships implements Node {
      field_call_to_action_goal: taxonomy_term__goals @link(from: "field_call_to_action_goal___NODE")
      field_tags: [relatedTaxonomyUnion] @link(from: "field_tags___NODE")
    }
    type node__career implements Node {
      drupal_id: String
      drupal_internal__nid: Int
      title: String
      changed: Date @dateformat
      body: BodyFieldWithSummary
      relationships: node__careerRelationships
      fields: node__careerFields
    }
    type node__careerFields implements Node {
      tags: [String]
    }
    type node__careerRelationships implements Node {
      field_tags: [relatedTaxonomyUnion] @link(from: "field_tags___NODE")
    }
    type node__course implements Node {
      drupal_id: String
      drupal_internal__nid: Int
      title: String
      field_code: String
      field_course_url: node__courseField_course_url
      field_credits: String
      field_level: Int
      relationships: node__courseRelationships
      fields: node__courseFields
    }
    type node__courseFields implements Node {
      tags: [String]
    }
    type node__courseField_course_url implements Node {
      uri: String
    }
    type node__courseRelationships implements Node {
      field_tags: [relatedTaxonomyUnion] @link(from: "field_tags___NODE")
    }
    type node__employer implements Node {
      drupal_id: String
      drupal_internal__nid: Int
      title: String
      field_employer_summary: BodyField
      field_image: ImageField
      field_link: FieldLink
      relationships: node__employerRelationships
      fields: node__employerFields
    }
    type node__employerFields implements Node {
      tags: [String]
    }
    type node__employerRelationships {
      field_image: file__file @link(from: "field_image___NODE")
      field_tags: [relatedTaxonomyUnion] @link(from: "field_tags___NODE")
    }
	type node__custom_footer implements Node {
	  drupal_id: String
      drupal_internal__nid: Int
	  body: BodyFieldWithSummary
	  relationships: node__custom_footerRelationships
	  fields: node__custom_footerFields
	}
	type node__custom_footerFields implements Node {
      tags: [String]
    }
	type node__custom_footerRelationships implements Node {
	  field_footer_logo: [media__image] @link(from: "field_footer_logo___NODE")
	  field_tags: [taxonomy_term__programs] @link(from: "field_tags___NODE")
	  field_widgets: [widgetParagraphUnion] @link(from:"field_widgets___NODE")
	}
    type node__page implements Node {
      drupal_id: String
      drupal_internal__nid: Int
      body: BodyFieldWithSummary
      field_hero_image: ImageField
      relationships: node__pageRelationships
      fields: FieldsPathAlias
    }
    type node__pageRelationships implements Node {
      field_hero_image: media__image @link(from: "field_hero_image___NODE")
      field_widgets: [widgetParagraphUnion] @link(from:"field_widgets___NODE")
      field_tags: [relatedTaxonomyUnion] @link(from: "field_tags___NODE")
    }	
    type node__link_url implements Node {
      title: String
      uri: String
    }
    type node__program implements Node {
      drupal_id: String
      drupal_internal__nid: Int
      title: String
      changed: Date @dateformat
      field_course_notes: node__programField_course_notes
      field_program_overview: node__programField_program_overview
      relationships: node__programRelationships
      fields: FieldsPathAlias
    }
    type node__programField_course_notes implements Node {
      value: String
      format: String
      processed: String
    }
    type node__programField_program_overview implements Node {
      value: String
      format: String
      processed: String		
    }	
    type node__programRelationships implements Node {
      field_program_acronym: taxonomy_term__programs @link(from: "field_program_acronym___NODE")
      field_courses: [node__course] @link(from: "field_courses___NODE")
      field_degrees: [taxonomy_term__degrees] @link(from: "field_degrees___NODE")
      field_program_statistics: [paragraph__program_statistic] @link(from: "field_program_statistics___NODE")
      field_program_variants: [relatedParagraphUnion] @link(from: "field_program_variants___NODE")
      field_specializations: [taxonomy_term__specializations] @link(from: "field_specializations___NODE")
      field_tags: [taxonomy_term__tags] @link(from: "field_tags___NODE")
    }
    type node__testimonial implements Node {
        drupal_id: String
        drupal_internal__nid: Int
        title: String
        body: BodyFieldWithSummary
        field_testimonial_person_desc: String
        field_hero_image: ImageField
        field_home_profile: FieldLink
        relationships: node__testimonialRelationships
        fields: node__testimonialFields
    }
    type node__testimonialFields implements Node {
      tags: [String]
    }
    type node__testimonialRelationships {
      field_hero_image: media__image @link(from: "field_hero_image___NODE")
      field_tags: [relatedTaxonomyUnion] @link(from: "field_tags___NODE")
    }	

	type paragraph__call_to_action implements Node {
      drupal_id: String
      field_cta_title: String
      field_cta_description: String
      field_cta_primary_link: FieldLink
      field_cta_secondary_link: FieldLink
      relationships: paragraph__call_to_actionRelationships
    }
    type paragraph__call_to_actionRelationships {
      field_call_to_action_goal: taxonomy_term__goals @link(from: "field_call_to_action_goal___NODE")
    }
	type paragraph__general_text implements Node {
      drupal_id: String
      field_general_text: BodyField
    }
	type paragraph__lead_paragraph implements Node {
      drupal_id: String
      field_lead_paratext: BodyField
    }
	type paragraph__links_items implements Node & WidgetParagraphInterface{
      drupal_id: String
      field_link_description: String
      field_link_url: node__link_url
      relationships: paragraph__links_itemsRelationships      
    }	
	type paragraph__links_itemsRelationships implements Node {
      field_link_image: media__image @link(from: "field_link_image___NODE")
    }
	type paragraph__links_widget implements Node {
	  drupal_id: String
	  field_link_items_description: String
	  field_link_items_title: String	  
	  relationships: paragraph__links_widgetRelationships
	}
	type paragraph__links_widgetRelationships implements Node {
	  field_link_items: [paragraph__link_item] @link(from: "field_link_items___NODE")
	}
	type paragraph__link_item implements Node {
	  drupal_id: String
	  field_link_description: String
	  field_link_image: media__image @link(from: "field_link_image___NODE")
	  field_link_url: FieldLink
	  relationships: paragraph__link_itemRelationships
	}
	type paragraph__link_itemRelationships implements Node {
	  drupal_id: String
	  paragraph__links_widget: [paragraph__links_widget] @link(from: "paragraph__links_widget___NODE")
	  field_link_image: media__image @link(from: "field_link_image___NODE")
	}
	type paragraph__media_text implements Node {
	  field_media_text_title: String
	  field_media_text_desc: BodyField
	  field_media_text_links: [FieldLink]	  
	  relationships: paragraph__media_textRelationships
	}
	type paragraph__media_textRelationships implements Node {
	  field_media_text_media: media__imagemedia__remote_videoUnion
	}
	type paragraph__program_statistic implements Node {
      drupal_id: String	  
      field_stat_range: Boolean
      field_stat_value: String
      field_stat_value_end: String
      relationships: paragraph__program_statisticRelationships
    }
    type paragraph__program_statisticRelationships implements Node {
      field_stat_icon: media__image @link(from: "field_stat_icon___NODE")
      field_stat_type: taxonomy_term__statistic_type @link(from: "field_stat_type___NODE")  
    }
    type paragraph__program_variants implements Node {
      drupal_id: String
      field_variant_title: String
      field_variant_link: FieldLink
      field_variant_info: BodyField
      relationships: paragraph__program_variantsRelationships
    }
    type paragraph__program_variantsRelationships {
      field_variant_name: taxonomy_term__program_variant_type
      field_variant_type: taxonomy_term__program_variant_type @link(from: "field_variant_type___NODE")
    }
	type paragraph__section implements Node & WidgetParagraphInterface {
      drupal_id: String
	  field_section_classes: String
	  field_section_title: String
      relationships: paragraph__sectionRelationships
    }
    type paragraph__sectionRelationships implements Node {
      field_section_content: [widgetSectionParagraphUnion] @link(from:"field_section_content___NODE")
    }
	
	type PathAlias implements Node {
      value: String
      alias: String
    }
	
	type TaxonomyDescription {
      processed: String
      value: String
      format: String
    }

    type taxonomy_term__degrees implements Node & TaxonomyInterface {
      drupal_id: String
      drupal_internal__tid: Int
      field_degree_acronym: String
      name: String
      description: TaxonomyDescription
    }
    type taxonomy_term__goals implements Node & TaxonomyInterface {
      drupal_id: String
      drupal_internal__tid: Int
      name: String
      field_goal_action: String
    }
	type taxonomy_term__news_category implements Node & TaxonomyInterface {
      drupal_id: String
      drupal_internal__tid: Int
      name: String
      description: TaxonomyDescription
    }
    type taxonomy_term__programs implements Node & TaxonomyInterface {
      drupal_id: String
      drupal_internal__tid: Int
      name: String
    }
    type taxonomy_term__programsRelationships {
      field_degrees: [taxonomy_term__degrees] @link(from: "field_degrees___NODE")
      field_specializations: [taxonomy_term__specializations]
      field_program_variants: [relatedParagraphUnion] @link(from: "field_program_variants___NODE")
      field_tags: [taxonomy_term__tags]
    }
    type taxonomy_term__program_variant_type implements Node {
      name: String
    }
    type taxonomy_term__specializations implements Node & TaxonomyInterface {
      drupal_id: String
      drupal_internal__tid: Int
      field_specialization_acronym: String
      name: String
      relationships: taxonomy_term__specializationsRelationships
      description: TaxonomyDescription
    }
    type taxonomy_term__specializationsRelationships {
      field_units: [taxonomy_term__units]
    }
    type taxonomy_term__statistic_type implements Node & TaxonomyInterface {
      drupal_id: String
      drupal_internal__tid: Int
      name: String
    }
    type taxonomy_term__tags implements Node & TaxonomyInterface {
      drupal_id: String
      drupal_internal__tid: Int
      name: String
      description: TaxonomyDescription
    }
    type taxonomy_term__testimonial_type implements Node & TaxonomyInterface {
      drupal_id: String
      drupal_internal__tid: Int
      name: String
    }
    type taxonomy_term__topics implements Node & TaxonomyInterface {
      drupal_id: String
      drupal_internal__tid: Int
      fields: FieldsPathAlias
      name: String
      description: TaxonomyDescription
    }
    type taxonomy_term__units implements Node & TaxonomyInterface {
      drupal_id: String
      drupal_internal__tid: Int
      field_unit_acronym: String
      name: String
      description: TaxonomyDescription
    }
  `
  createTypes(typeDefs)
}

exports.onCreateNode = ({ node, createNodeId, actions }) => {
	const { createNodeField } = actions

	// Handle nodes that point to multiple tag vocabularies and allows us to filter by that tag in our Gatsby template query
	// INSTRUCTION: If you've added a new content-type and it contains a field that references
	// multiple vocabularies, then add it to the if statement
	if (node.internal.type === `media__image` || 
		node.internal.type === `node__article` || 
		node.internal.type === `node__call_to_action` ||
		node.internal.type === `node__career` || 
		node.internal.type === `node__course` || 
		node.internal.type === `node__employer` ||
		node.internal.type === `node__page` || 
		node.internal.type === `node__testimonial`
	) {
	createNodeField({
		node,
		name: `tags`,
		value: node.relationships.field_tags___NODE,
		})
	}

	// Handle nodes that require page aliases
	// INSTRUCTION: If you've added a new content-type and need each node to generate a page
	// then add it to the following if statement
	if (node.internal.type === `node__article` || 
		node.internal.type === `node__page` || 
		node.internal.type === `node__program` ) {
        
		/* Create page path */
		const aliasID = createNodeId(`alias-${node.drupal_id}`);

		// add  mapped alias node as a field
		createNodeField({
			node,
			name: "alias",
			value: aliasID,
		})

		/* Set content field for search */
		/*    - return body of content */
		if (typeof node.body !== 'undefined' && node.body !== null) {
			content = `${node.body.processed}`
		}
		/*    - return description of taxonomy */
		else if (typeof node.description !== 'undefined' && node.description !== null) {
			content = `${node.description.processed}`
		}
		/*    - set default content */
		else {
			content = ''
		}
		createNodeField({
			node,
			name: `content`,
			value: content,
		})
	}
}

exports.createPages = async ({ graphql, actions, createContentDigest, createNodeId, reporter }) => {

	// INSTRUCTION: Add new page templates here (e.g. you may want a new template for a new content type)
	const pageTemplate = path.resolve('./src/templates/basic-page.js');
	const articleTemplate = path.resolve('./src/templates/article-page.js');
	const programTemplate = path.resolve('./src/templates/program-page.js');
	
	const helpers = Object.assign({}, actions, {
		createContentDigest,
		createNodeId,
	})

	// INSTRUCTION: Query for menu and page template content here

	const result = await graphql(`
    {
      pages: allNodePage {
        edges {
          node {
            id
            drupal_id
            drupal_internal__nid
            title
          }
        }
      }
      articles: allNodeArticle {
        edges {
          node {
            id
            drupal_id
            drupal_internal__nid
            title
          }
        }
      }
      programs: allNodeProgram {
        edges {
          node {
            title
            id
            drupal_id
            drupal_internal__nid
            relationships {
              field_program_acronym {
                id
                name
              }
            }
          }
        }
      }

      menus: allMenuItems {
        edges {
          node {
            title
			description
            menu_name
            id
            parent {
              id
            }
            url
            route {
              parameters {
                node
              }
            }
            children {
              ... on MenuItems {
                id
                url
                title
				description
				parent {
				  id
				}
                children {
                  ... on MenuItems {
                    id
                    url
                    title
					description
					parent {
					  id
					}
                    children {
                      ... on MenuItems {
                        id
                        url
                        title
						description
						parent {
						  id
						}
                        route {
                          parameters {
                            node
                          }
                        }
                      }
                    }
                    route {
                      parameters {
                        node
                      }
                    }
                  }
                }
                route {
                  parameters {
                    node
                  }
                }
              }
            }
          }
        }
      }      
    }
  `)

	if (result.errors) {
		reporter.panicOnBuild('ERROR: Loading "createPages" query')
	}

	if (result.data !== undefined) {

		// INSTRUCTION: Create a page for each node by processing the results of your query here
		// Each content type should have its own if statement code snippet

		let aliases = {};

		// process page nodes
		if (result.data.pages !== undefined) {
			const pages = result.data.pages.edges;
			pages.forEach(( { node }, index) => {
				aliases[node.drupal_internal__nid] = processPage(
					node, 
					node.id, 
					createContentTypeAlias, 
					pageTemplate, 
					helpers
				);
			})
		}

		// process article nodes
		if (result.data.articles !== undefined) {
			const articles = result.data.articles.edges;
			articles.forEach(( { node }, index) => {
				aliases[node.drupal_internal__nid] = processPage(
					node, 
					node.id, 
					createArticleAlias, 
					articleTemplate, 
					helpers
				);
			})
		}

		// process program nodes
		if (result.data.programs !== undefined) {
			const programs = result.data.programs.edges;
			programs.forEach(( { node }, index) => {
				aliases[node.drupal_internal__nid] = processPage(
					node, 
					node.relationships.field_program_acronym.id, 
					createProgramAlias, 
					programTemplate, 
					helpers
				);
			})
		}

		
		// process menu nodes and pass through aliases
		if (result.data.menus !== undefined) {			
			const menus = result.data.menus.edges;
			const config = require('./gatsby-config');
			const menuNames = config.siteMetadata.menus;			
			menuNames.forEach(element => createSitemap(menus, element, aliases));
    }
    // proces aliases for each page/node
    createAliasFile(aliases);
	}
}

function createSitemap(menus, whichMenu, aliases) {
	let sitemap = [];
	const sitemapFile = 'config/sitemaps/' + whichMenu + '.yml';

	menus.forEach(( { node }, index) => {
		if (node.parent === null && node.menu_name === whichMenu) {
			sitemap.push(processMenuItem( node, aliases ));
		}
	})

	let yamlStr = yaml.safeDump(sitemap);
	fs.writeFileSync(sitemapFile, yamlStr, 'utf8');  
}

function processMenuItem(node, aliases){
	if (node !== undefined) {
		const drupalID = (node.route.parameters !== null && node.route.parameters !== undefined) ? node.route.parameters.node : '';
		const gatsbyAlias = (aliases[drupalID] !== null && aliases[drupalID] !== undefined) ? aliases[drupalID] : '';
		const menuURL = node.url;

		const menuNode = {
			id: node.id,
			drupal_id: drupalID,
			alias: gatsbyAlias,
			url: menuURL,
			title: node.title,
			description: node.description,
			parent: node.parent,
			children: processMenuItemChildren(node.children, aliases),
		} 
		return menuNode;
	}
	return null;
}

function processMenuItemChildren(children, aliases) {
	let childrenMenuItems = [];  
	if (children !== undefined) { 
		children.forEach((child, index ) => {
			childrenMenuItems.push(processMenuItem(child, aliases));
		})
	}
	return childrenMenuItems;
}
function createAliasFile(aliases) {
  const aliasFile = 'config/aliases/aliasfile.yml';
  let yamlStr = yaml.safeDump(aliases);
  fs.writeFileSync(aliasFile, yamlStr, 'utf8'); 
 }
 
function processPage(node, contextID, functionToRetrieveAlias, template, helpers) {
    let alias = functionToRetrieveAlias(node);
    createNodeAlias(node, alias, helpers);

    helpers.createPage({
      path: alias,
      component: template,
      context: {
        id: contextID,
      },
    })

    return alias;
}

function createNodeAlias(node, alias, helpers){
	const aliasID = helpers.createNodeId(`alias-${node.drupal_id}`);
	const aliasData = {
		key: aliasID,
		value: alias,
	}
	const aliasContent = JSON.stringify(aliasData);
	const aliasMeta = {
		id: aliasID,
		parent: null,
		children: [],
		internal: {
			type: `PathAlias`,
			mediaType: `text/html`,
			content: aliasContent,
			contentDigest: helpers.createContentDigest(aliasData)
		}
	}
	const aliasNode = Object.assign({}, aliasData, aliasMeta);
	helpers.createNode(aliasNode);
}

// use for content types
function createContentTypeAlias(node, prepend = '') {
	let alias = `/` + slugify(node.title);

	if (prepend !== '') {
		alias = `/` + slugify(prepend) + alias;
	}
	
	return alias;
}

// use for taxonomies
function createTaxonomyAlias(node, prepend = '') {
	let alias = `/` + slugify(node.name);

	if (prepend !== '') {
		alias = `/` + slugify(prepend) + alias;
	}

	return alias;
}

function createProgramAlias(node) {
	let alias = createContentTypeAlias(node, `programs`)
	return alias;
}

function createArticleAlias(node) {
	let alias = createContentTypeAlias(node, `news`)
	return alias;
}


// Source: https://medium.com/@mhagemann/the-ultimate-way-to-slugify-a-url-string-in-javascript-b8e4a0d849e1
function slugify(string) {
	const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
	const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
	const p = new RegExp(a.split('').join('|'), 'g')

	return string.toString().toLowerCase()
	.replace(/\s+/g, '-') // Replace spaces with -
	.replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
	.replace(/&/g, '-and-') // Replace & with 'and'
	.replace(/[^\w\-]+/g, '') // Remove all non-word characters
	.replace(/\-\-+/g, '-') // Replace multiple - with single -
	.replace(/^-+/, '') // Trim - from start of text
	.replace(/-+$/, '') // Trim - from end of text
}