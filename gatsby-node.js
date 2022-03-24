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

exports.createSchemaCustomization = ({ actions, schema }) => {
    
  const { createTypes } = actions
  
  const typeDefs = [
    
    `interface TaxonomyInterface implements Node {
      id: ID!
      drupal_id: String
      name: String
    }
    interface WidgetParagraphInterface implements Node {
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
      paragraph__call_to_action
      | paragraph__events_widget
      | paragraph__general_text
      | paragraph__lead_paragraph
      | paragraph__link_item
      | paragraph__links_widget
      | paragraph__media_text
      | paragraph__section
      | paragraph__stats_widget
      | paragraph__section_tabs
      | paragraph__tab_content
      | paragraph__accordion_section

    union widgetSectionParagraphUnion =
      paragraph__call_to_action
      | paragraph__general_text
      | paragraph__lead_paragraph
      | paragraph__link_item
      | paragraph__links_widget
      | paragraph__media_text
      | paragraph__stats_widget
      | paragraph__section_buttons
      | paragraph__button_widget

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
    type FieldAccordionBlockText {
      processed: String
      value: String
      format: String
      summary: String
    }
    type FieldFormattedTitle {
      processed: String
      value: String
      format: String
    }
    type AliasPath {
      alias: String
    }
    type FieldLink {
      title: String
      uri: String
      url: String
    }
    type FieldsPathAlias {
      alias: PathAlias @link
      content: String
      tags: [String]
    }
    
    type ImageField implements Node {
      alt: String
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
      node__page: [node__page] @link(from: "node__page___NODE")
      node__program: [node__program] @link(from: "node__program___NODE")
    }
    type media__remote_video implements Node {
      drupal_id: String
      name: String
      field_media_oembed_video: String
      field_video_width: Int
      field_video_height: Int
      relationships: media__remote_videoRelationships
    }
    type media__remote_videoRelationships implements Node {
      field_media_file: file__file @link(from: "field_media_file___NODE")
      field_video_cc: file__file @link(from: "field_video_cc___NODE")
      node__program: [node__program] @link(from: "node__program___NODE")
    }
    
    type menu_link_content__menu_link_content implements Node {
      bundle: String
      drupal_id: String
      drupal_parent_menu_item: String
      enabled: Boolean
      expanded: Boolean
      external: Boolean
      langcode: String
      link: menu_link_content__menu_link_contentLink
      menu_name: String
      title: String
      weight: Int      
    }
    type menu_link_content__menu_link_contentLink implements Node {
      uri: String
      url: String
      title: String
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
      path: AliasPath
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
      changed: Date
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
      changed: String
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
      field_tags: [relatedTaxonomyUnion] @link(from: "field_tags___NODE")
      field_widgets: [widgetParagraphUnion] @link(from:"field_widgets___NODE")
    }
    type node__page implements Node {
      drupal_id: String
      drupal_internal__nid: Int
      field_hero_image: ImageField
      field_metatags: node__pageField_metatags
      relationships: node__pageRelationships
      fields: FieldsPathAlias
      path: AliasPath
    }
    type node__pageField_metatags implements Node {
      og_description: String
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
      field_prog_image: ImageField
      field_course_notes: node__programField_course_notes
      field_metatags: node__programField_metatags
      field_program_overview: node__programField_program_overview
      relationships: node__programRelationships
      fields: FieldsPathAlias
      path: AliasPath
    }
    type node__programField_course_notes implements Node {
      value: String
      format: String
      processed: String
    }
    type node__programField_metatags implements Node {
      og_description: String
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
      field_prog_image: media__image @link(from: "field_prog_image___NODE")
    }
    type node__testimonial implements Node {
      changed: Date
      created: Date
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
    type paragraph__accordion_block implements Node {
      drupal_id: String
      field_accordion_block_text: FieldAccordionBlockText      
      field_accordion_title: String
    }
    type paragraph__accordion_section implements Node {
      drupal_id: String
      field_accordion_stay_open: Boolean
      relationships: paragraph__accordion_sectionRelationships
    }
    type paragraph__accordion_sectionRelationships implements Node {
      field_accordion_block_elements: [paragraph__accordion_block] @link(from: "field_accordion_block_elements___NODE")
    } 
    type paragraph__button_widget implements Node {
      drupal_id: String
      field_button_link: FieldLink
      field_font_awesome_icon: String
      field_formatted_title: FieldFormattedTitle
      field_cta_heading: FieldFormattedTitle
      relationships: paragraph__button_widgetRelationships
    }
    type paragraph__button_widgetRelationships {
      field_cta_analytics_goal: taxonomy_term__goals @link(from: "field_cta_analytics_goal___NODE")
      field_button_style:taxonomy_term__button_styles @link(from: "field_button_style___NODE")
      field_font_awesome_icon_colour: taxonomy_term__colour_variables @link(from: "field_font_awesome_icon_colour___NODE")
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
      field_section_column: taxonomy_term__section_columns @link(from: "field_section_column___NODE")
    }
    type paragraph__events_widget implements Node {
      drupal_id: String
      field_match_categories: Boolean
      field_title: String
      relationships: paragraph__events_widgetRelationships
    }
    type paragraph__events_widgetRelationships implements Node {
      field_event_category: [taxonomy_term__event_categories] @link(from: "field_event_category___NODE")
    }
    type paragraph__general_text implements Node {
      drupal_id: String
      field_general_text: BodyField
    }
    type paragraph__general_textRelationships {
      field_section_column: taxonomy_term__section_columns @link(from: "field_section_column___NODE")
    }
    type paragraph__lead_paragraph implements Node {
      drupal_id: String
      field_lead_paratext: BodyField
      relationships: node__lead_paragraphRelationships
    }
    type node__lead_paragraphRelationships implements Node {
      field_lead_para_hero: media__image @link(from: "field_lead_para_hero___NODE")
      field_section_column: taxonomy_term__section_columns @link(from: "field_section_column___NODE")
    }
    type paragraph__tab_content implements Node {
      drupal_id: String
      field_tab_title: String
      field_tab_body: BodyField
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
      field_media_image_size: String
      field_media_text_desc: BodyField      
      field_media_text_title: String      
      field_media_text_links: [FieldLink]    
      relationships: paragraph__media_textRelationships
    }
    type paragraph__media_textRelationships implements Node {
      field_section_column: taxonomy_term__section_columns @link(from: "field_section_column___NODE")
      field_media_text_media: media__imagemedia__remote_videoUnion @link(from: "field_media_text_media___NODE")
      field_button_section: paragraph__section_buttons @link(from:"field_button_section___NODE")
    }
    type paragraph__program_statistic implements Node {
      drupal_id: String   
      field_stat_range: Boolean
      field_stat_value: String
      field_stat_value_end: String
      field_font_awesome_icon: String
      relationships: paragraph__program_statisticRelationships
    }
    type paragraph__program_statisticRelationships implements Node {
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
    type paragraph__section_buttons implements Node {
      drupal_id: String
      relationships: paragraph__section_buttonsRelationships
    }
    type paragraph__section_buttonsRelationships {
      field_section_column: taxonomy_term__section_columns @link(from: "field_section_column___NODE")
      field_buttons: [paragraph__button_widget] @link(from:"field_buttons___NODE")
    }
    type paragraph__section_tabs implements Node {
      drupal_id: String
      relationships: paragraph__section_tabsRelationships
    }
    type paragraph__section_tabsRelationships {
      field_tabs: [paragraph__tab_content] @link(from:"field_tabs___NODE")
    }
    type paragraph__stats_widget implements Node {
      drupal_id: String
      relationships: paragraph__stats_widgetRelationships
    }
    type paragraph__stats_widgetRelationships implements Node {
      field_statistic: [paragraph__program_statistic] @link(from: "field_statistic___NODE")
      field_section_column: taxonomy_term__section_columns @link(from: "field_section_column___NODE")
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
    type taxonomy_term__button_styles implements Node & TaxonomyInterface {
      drupal_id: String
      drupal_internal__tid: Int
      name: String
    }
    type taxonomy_term__colour_variables implements Node & TaxonomyInterface {
      drupal_id: String
      drupal_internal__tid: Int
      name: String
    }
    type taxonomy_term__degrees implements Node & TaxonomyInterface {
      drupal_id: String
      drupal_internal__tid: Int
      field_degree_acronym: String
      name: String
      description: TaxonomyDescription
    }
    type taxonomy_term__event_categories implements Node & TaxonomyInterface {
      drupal_id: String
      name: String
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
    type taxonomy_term__section_columns implements Node & TaxonomyInterface {
      drupal_id: String
      drupal_internal__tid: Int
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
    
    type WpEventToEventsCategoryConnection implements Node {
      nodes: [WpEventsCategory]
    }
    type WpEventsCategory implements Node {
      name: String
    }    
    `,
    
    schema.buildObjectType({
      name: `WpEvent`,
      interfaces: [`Node`],
      fields: {
        endDate: `String`,
        startDate: `String`,
        title: `String`,
        url: `String`,
        eventsCategories: `WpEventToEventsCategoryConnection`,
        isPast: {
          type: `Boolean`,
          resolve: (source) => new Date(source.startDate) < new Date(),
        },
      },
    }),
  ]
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
        node.internal.type === `node__custom_footer` ||
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

// Suppress chunk out-of-order warnings
exports.onCreateWebpackConfig = helper => {    
    const { actions, getConfig } = helper
    const config = getConfig()
    const miniCssExtractPlugin = config.plugins.find(
        plugin => plugin.constructor.name === "MiniCssExtractPlugin"
    )
    if (miniCssExtractPlugin) {
        miniCssExtractPlugin.options.ignoreOrder = true
    }
    actions.replaceWebpackConfig(config)        
}

exports.createPages = async ({ graphql, actions, createNodeId, reporter }) => {

    // INSTRUCTION: Add new page templates here (e.g. you may want a new template for a new content type)
    const pageTemplate = path.resolve('./src/templates/page.js');
    //const articleTemplate = path.resolve('./src/templates/article-page.js');
    const programTemplate = path.resolve('./src/templates/program-page.js');
    
    const helpers = Object.assign({}, actions, {
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
            fields {
              tags
            }
            path {
              alias
            }
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
            path {
              alias
            }
          }
        }
      }
      programs: allNodeProgram {
        edges {
          node {
            title
            path {
              alias
            }
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
                    node.drupal_internal__nid,
                    node.fields.tags,
                    node.path, 
                    pageTemplate, 
                    helpers
                );
            })
        }

/*         // process article nodes
        if (result.data.articles !== undefined) {
            const articles = result.data.articles.edges;
            articles.forEach(( { node }, index) => {
                aliases[node.drupal_internal__nid] = processPage(
                    node, 
                    node.id, 
                    node.path, 
                    articleTemplate, 
                    helpers
                );
            })
        } */

        // process program nodes
        if (result.data.programs !== undefined) {
            const programs = result.data.programs.edges;
            programs.forEach(( { node }, index) => {
                aliases[node.drupal_internal__nid] = processPage(
                    node,
                    node.relationships.field_program_acronym.id,
                    node.drupal_internal__nid,
                    null,
                    node.path, 
                    programTemplate, 
                    helpers
                );
            })
        }
    }
}

function processPage(node, contextID, nodeNid, tagID, nodePath, template, helpers) {
    let alias = createContentTypeAlias(nodePath);

    helpers.createPage({
      path: alias,
      component: template,
      context: {
        id: contextID,
        nid: `entity:node/` + nodeNid,
        tid: tagID,
      },
    })

    return alias;
}

// use for content types
function createContentTypeAlias(nodePath) {
    let alias = '';

    if (nodePath !== '') {
        alias = nodePath.alias;
    } else {
        alias = `/` + slugify(node.title);
    }
    return alias;
}

// list of pages for SE site
function createSitePageList(helpers) {

    helpers.createPage({
      path: `/sitemap-se/`,
      component: path.resolve(`./src/templates/sitemap-page.js`),
      context: {
         searchfilt: `/studentexperience/`,
      },
    })

    return;
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
