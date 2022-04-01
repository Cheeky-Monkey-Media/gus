import React from 'react';
import Layout from 'components/layout';
import { Helmet } from 'react-helmet';
import Seo from 'components/seo';
import Hero from 'components/shared/hero';
import Breadcrumbs from 'components/shared/breadcrumbs';
import CallToAction from 'components/shared/callToAction';
import Careers from 'components/shared/careers';
import Courses from 'components/shared/courses';
import CustomFooter from 'components/shared/customFooter';
import Degrees from 'components/shared/degrees';
import Employers from 'components/shared/employers';
import HeroVideo from 'components/shared/heroVideo';
import NavTabs from 'components/shared/navTabs';
import NavTabHeading from 'components/shared/navTabHeading';
import NavTabContent from 'components/shared/navTabContent';
import NewsGrid from 'components/shared/newsGrid';
import Stats from 'components/shared/stats'
import Testimonials from 'components/shared/testimonial';
import Variants from 'components/shared/variants'; 
import { sortLastModifiedDates } from 'utils/ug-utils';
import { graphql } from 'gatsby';

function renderProgramOverview(description, specData) {
    if (description || specData?.length>0) {
        return <><h2>Program Overview</h2><div dangerouslySetInnerHTML={{ __html: description }} /></>
    }    
    return null;
}

function renderProgramStats(degreesData, variantData, statsData) {
    
    if (statsData?.length>0 || degreesData?.length>0) {
        return <>
        <div className="full-width-container stats-bg">
            <div className="container page-container">
                <section className="row row-with-vspace site-content">
                    <div className="col-md-12 content-area">
                        <h2 className="sr-only">Program Statistics</h2>
                        <dl className="d-flex flex-wrap flex-fill justify-content-center">
                            <Degrees degreesData={degreesData} />
                            {CountProgramVariants(variantData)}
                            <Stats statsData={statsData} />
                        </dl>
                    </div>
                </section>
            </div>
        </div>
        </>
    }    
    return null;
}

function CountProgramVariants(variantData) {

    let majors = [];
    let minors = [];
    let certificates = [];
    let assocDiplomas = [];
    
    if (variantData?.length > 0) {
        variantData.forEach((edge) => {
            if ((edge.__typename === "paragraph__program_variants") && (edge.relationships.field_variant_type !== null)) {
                switch(edge.relationships.field_variant_type.name) {
                    case "Associate Diplomas":
                        assocDiplomas.push(edge.relationships.field_variant_type.name);
                    break;
                    case "Certificates":
                        certificates.push(edge.relationships.field_variant_type.name);
                    break;
                    case "Minors":
                        minors.push(edge.relationships.field_variant_type.name);                        
                    break;  
                    default:
                        majors.push(edge.relationships.field_variant_type.name);
                }
            }
        }); 
        return <>     
            {majors?.length>0 && <>
                <div className="uog-card">
                    <dt><span className="fa-icon-colour"><i className="fa-solid fa-file-certificate" aria-hidden="true">  </i></span> {majors.length}</dt>
                    <dd>Specialized Majors</dd>
                </div>
            </>}
            {minors?.length>0 && <>
                <div className="uog-card">
                    <dt><span className="fa-icon-colour"><i className="fa-solid fa-file-certificate" aria-hidden="true">  </i></span> {minors.length}</dt>
                    <dd>Specialized Minors</dd>
                </div>
            </>}
            {assocDiplomas?.length>0 && <>
                <div className="uog-card">
                    <dt><span className="fa-icon-colour"><i className="fa-solid fa-file-certificate" aria-hidden="true">  </i></span> {assocDiplomas.length}</dt>
                    <dd>Associate Diplomas</dd>
                </div>
            </>}
            {certificates?.length>0 && <>
                <div className="uog-card">
                    <dt><span className="fa-icon-colour"><i className="fa-solid fa-file-certificate" aria-hidden="true">  </i></span> {certificates.length}</dt>
                    <dd>Optional Certificates</dd>
                </div>
            </>}
        </>
    }    
    return null;
}

function renderProgramInfo (courseData, courseNotes, variantDataHeading, variantData, careerData, employerData) {
    let activeValue = true;
    let activeTabExists = false;
    let navTabHeadings = [];
    let navTabContent = [];
    let key = 0;
    let tabContent = false;

    // prep TAB 1 - Courses
    if (courseNotes || courseData?.length>0) {
        tabContent = true;
        const courseHeading = "Selected Courses";
        const courseID = "pills-courses";
        if (!activeTabExists) {
            activeTabExists = true;
        } else {
            activeValue = false;
        }
        key++;
        navTabHeadings.push(<NavTabHeading key={`navTabHeading-` + key} active={activeValue} heading={courseHeading} controls={courseID} />);

        navTabContent.push(<NavTabContent key={`navTabContent-` + key} 
                                          active={activeValue} 
                                          heading={courseHeading} 
                                          headingLevel="h3" 
                                          id={courseID} 
                                          content={<Courses courseData={courseData} courseNotes={courseNotes} headingLevel="h4" />} 
                            />);
        }

    // prep TAB 2 - Variants
    if (variantDataHeading) {
        tabContent = true;
        const variantID = "pills-variants";
        if (!activeTabExists) {
            activeTabExists = true;
        } else {
            activeValue = false;
        }
        key++;
        navTabHeadings.push(<NavTabHeading key={`navTabHeading-` + key} active={activeValue} heading={variantDataHeading} controls={variantID} />);

        navTabContent.push(<NavTabContent key={`navTabContent-` + key} 
                                          active={activeValue} 
                                          heading={variantDataHeading} 
                                          headingLevel="h3" 
                                          id={variantID} 
                                          content={<Variants variantData={variantData} />} 
                            />);
    }

    // prep TAB 3 - Careers
    if (careerData?.length>0) {
        tabContent = true;
        if (!activeTabExists) {
            activeTabExists = true;
        } else {
            activeValue = false;
        }
        const careersHeading = "Careers";
        const careersID = "pills-careers";
        key++;

        navTabHeadings.push(<NavTabHeading key={`navTabHeading-` + key} active={activeValue} heading={careersHeading} controls={careersID} />);

        navTabContent.push(<NavTabContent key={`navTabContent-` + key} 
                                          active={activeValue} 
                                          heading={careersHeading} 
                                          headingLevel="h3" 
                                          id={careersID} 
                                          content={<Careers careerData={careerData} numColumns={3} />} 
                            />);
    }
    
    // prep TAB 4 - Employers
    if (employerData?.length > 0) {
        tabContent = true;
        if (activeTabExists === false) {
            activeTabExists = true;
        } else {
            activeValue = false;
        }
        const employerHeading = "Employers";
        const employerID = "pills-employer";
        key++;

        navTabHeadings.push(<NavTabHeading key={`navTabHeading-` + key} active={activeValue} heading={employerHeading} controls={employerID} />);

        navTabContent.push(<NavTabContent key={`navTabContent-` + key} 
                                          active={activeValue} 
                                          heading={employerHeading} 
                                          headingLevel="h3" 
                                          id={employerID} 
                                          content={<Employers employerData={employerData} />} 
                            />);
    }
    if (tabContent) {
        return <React.Fragment>
                <h2>Program Information</h2>
                <NavTabs headings={
                    navTabHeadings.map((heading) => {
                        return heading;
                        })
                    }>
                    {navTabContent.map((content) => {
                        return content;
                    })}
                </NavTabs>
            </React.Fragment>
    }
    return null;
}

function retrieveLastModifiedDates (content) {
    let dates = [];
    if (content?.length > 0) {  
        content.forEach((edge) => {
            dates.push(edge.node.changed);
        })
    }
    return dates;
}

function prepareVariantHeading (variantData) {
    let labels = [];

  // prepare variant data labels
    variantData.forEach((edge) => {
        if ((edge.__typename === "paragraph__program_variants") && (edge.relationships.field_variant_type !== null)) {
            labels.push(edge.relationships.field_variant_type.name);
        }
    });

    const uniqueLabelSet = new Set(labels);
    const uniqueLabels = [...uniqueLabelSet];
    let variantHeading = "";

    for (let i=0; i<uniqueLabels.length; i++) {
        if (i > 0) { 
            if (uniqueLabels.length > 2) {
                variantHeading += ",";
            }
            variantHeading += " ";
            if (i === (uniqueLabels.length - 1)) {
                variantHeading += "and ";
            }
        }
        variantHeading += uniqueLabels[i];
    }
  
  return variantHeading;
}

const ProgramPage = ({data, location}) => {
        
    let progData = data.programs.edges[0]?.node;
    let callToActionData = data.ctas?.edges;
    let careerData = data.careers?.edges;
    let courseData = progData.relationships?.field_courses;
    let degreesData = progData.relationships?.field_degrees;
    let domains = progData?.field_domain_access;
    let employerData = data.employers?.edges;
    let footerData = data.footer?.edges;
    let imageData =  data.images?.edges;
    let imageTaggedData = data.imagesTagged?.edges;    
    let newsData = data.news?.edges;
    let specData = progData.relationships?.field_specializations;
    let statsData = progData.relationships?.field_program_statistics;
    let testimonialData = data.testimonials?.edges;
    let variantData = progData.relationships?.field_program_variants;
    let variantDataHeading = prepareVariantHeading(variantData);
    let videoData = data.videos.edges[0]?.node;
  
    const heroImage = (imageData?.length>0 ? imageData : (imageTaggedData?.length>0 ? imageTaggedData : null));
    
    // Open Graph metatags
    const ogDescription = progData.field_metatags?.og_description;
    const ogImage = heroImage && heroImage[0]?.node.relationships.field_media_image.localFile.publicURL;
    const ogImageAlt = heroImage && heroImage[0]?.node.field_media_image.alt;

    // set program details
    const nodeID = progData.drupal_internal__nid;
    const title = progData.title;
    const acronym = (progData.relationships.field_program_acronym?.name);
    const description = progData.field_program_overview?.processed;
    const courseNotes = progData.field_course_notes?.processed;

    // set last modified date
    let allModifiedDates = sortLastModifiedDates(
        [progData.changed, retrieveLastModifiedDates(callToActionData), retrieveLastModifiedDates(testimonialData)]
        );
    let lastModified = allModifiedDates[allModifiedDates.length - 1];
    
    return (
    <Layout date={lastModified} menuName="main">
        <Helmet bodyAttributes={{ class: "program" }} />            
        <Seo title={title} description={ogDescription} img={ogImage} imgAlt={ogImageAlt} />
      
        { /**** Header and Title ****/ }
        <div className={!heroImage?.length>0 && !videoData?.length>0 ? "no-thumb" : null} id="rotator">
            {videoData ?
            <HeroVideo videoURL={videoData.field_media_oembed_video} videoWidth={videoData.field_video_width} videoHeight={videoData.field_video_height} videoTranscript={videoData.relationships.field_media_file?.localFile.publicURL} />
            :
            <Hero imgData={heroImage} />
            }
            <div className="container ft-container"><h1 className="fancy-title">{title}</h1></div>
        </div>

        { /**** Blurb and Call to Action Button ****/ }
        {ogDescription || callToActionData?.length>0 ? 
        <div className="full-width-container bg-dark">
            <div className="container">
                <section className="row mx-2">
                    {ogDescription && <div className="col-md-9"><p className="fs-2">{ogDescription}</p></div>}
                    {callToActionData?.length>0 && 
                    <div className="col-md-3">
                      <CallToAction href={callToActionData[0]?.node.field_call_to_action_link.uri} 
                        goalEventCategory={callToActionData[0]?.node.relationships.field_call_to_action_goal?.name} 
                        goalEventAction={callToActionData[0]?.node.relationships.field_call_to_action_goal?.field_goal_action}>
                        {callToActionData[0]?.node.field_call_to_action_link.title}
                      </CallToAction>
                    </div>}
                </section>
            </div>
        </div> : ``}
      
        <Breadcrumbs nodeID={nodeID} nodeTitle={title} domains={domains} />

        { /**** Program Overview ****/ }
        <div className="container page-container">
            <div className="row site-content">
                <section className="content-area">
                    {renderProgramOverview(description, specData)}
                </section>
            </div>
        </div>
    
        { /**** Program Stats ****/ }
        {renderProgramStats(degreesData, variantData, statsData)}

        { /**** Program Information Tabs ****/ }
        <div className="container page-container">
            <section className="row row-with-vspace site-content">
                <div className="col-md-12 content-area">
                    {renderProgramInfo(courseData, courseNotes, variantDataHeading, variantData, careerData, employerData)}
                </div>
            </section>
        </div>                    

        { /**** Testimonials ****/ }
        {testimonialData && <Testimonials testimonialData={testimonialData} programAcronym={acronym} headingLevel='h3' />}

        { /*** News ****/}
        {newsData && <NewsGrid newsData={newsData} heading="Program News" headingLevel='h2' />}

        { /**** Call to Actions ****/ }
        {callToActionData.length !== 0 &&
        <div className="container page-container apply-footer">
            <section className="row row-with-vspace site-content">
                <div className="col-sm-12 col-md-6 offset-md-3 col-lg-4 offset-lg-4 content-area">
                    <h3><span>Are you ready to</span> Improve Life?</h3>
                    {callToActionData.map((cta, index) => (
                        <CallToAction key={index} href={cta.node.field_call_to_action_link.uri} 
                            goalEventCategory={cta?.node.relationships.field_call_to_action_goal?.name} 
                            goalEventAction={cta?.node.relationships.field_call_to_action_goal?.field_goal_action}
                        >
                            {cta.node.field_call_to_action_link.title}
                        </CallToAction>
                    ))}
                </div>
            </section>
        </div>
        }
        {footerData?.length>0 && <CustomFooter footerData={footerData[0]} />}     
    </Layout>  
    )   
}

export default ProgramPage;

export const query = graphql`query ($id: String) {
  programs: allNodeProgram(
    filter: {relationships: {field_program_acronym: {id: {eq: $id}}}}
  ) {
    edges {
      node {
        changed
        drupal_id
        drupal_internal__nid
        title
        field_domain_access {
          drupal_internal__target_id
        }
        field_metatags {
          og_description
        }
        field_program_overview {
          processed
        }
        field_course_notes {
          processed
        }
        relationships {
          field_prog_image {
            field_media_image {
              alt
            } 
            relationships {
              field_media_image {               
                localFile {
                  publicURL
                  childImageSharp {
                      gatsbyImageData(
                  transformOptions: {cropFocus: CENTER}
                  placeholder: BLURRED
                  aspectRatio: 3
                )
                   }
                }
              }
            }
          }
          field_program_acronym {
            name
            id
          }
          field_courses {
            changed
            field_credits
            field_level
            field_code
            title
            field_course_url {
              uri
            }
          }
          field_degrees {
            drupal_id
            name
            field_degree_acronym
          }
          field_specializations {
            name
          }
          field_program_statistics {
            drupal_id
            field_stat_range
            field_stat_value
            field_stat_value_end
            field_font_awesome_icon
            relationships {
              field_stat_type {
                name
              }
            }
          }
          field_tags {
            name
          }
          field_program_variants {
            __typename
            ... on paragraph__general_text {
              drupal_id
              field_general_text {
                processed
              }
            }
            ... on paragraph__program_variants {
              drupal_id
              field_variant_title
              field_variant_link {
                uri
              }
              field_variant_info {
                processed
              }
              relationships {
                field_variant_type {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
  ctas: allNodeCallToAction(filter: {fields: {tags: {in: [$id]}}}) {
    edges {
      node {
        changed
        field_call_to_action_link {
          title
          uri
        }
        relationships {
          field_call_to_action_goal {
            name
            field_goal_action
          }
          field_tags {
            __typename
            ... on TaxonomyInterface {
              drupal_id
              id
              name
            }
          }
        }
      }
    }
  }
  careers: allNodeCareer(
    sort: {fields: [title], order: ASC}
    filter: {fields: {tags: {in: [$id]}}}
  ) {
    edges {
      node {
        title
        drupal_id
        changed
        body {
          processed
        }
        relationships {
          field_tags {
            __typename
            ... on TaxonomyInterface {
              drupal_id
              id
              name
            }
          }
        }
      }
    }
  }
  employers: allNodeEmployer(
    sort: {fields: title}
    filter: {fields: {tags: {in: [$id]}}}
  ) {
    edges {
      node {
        drupal_id
        field_employer_summary {
          processed
        }
        title
        field_image {
          alt
        }
        field_link {
          uri
        }
        relationships {
          field_tags {
            __typename
            ... on TaxonomyInterface {
              drupal_id
              id
              name
            }
          }
          field_image {
            localFile {
              url
              childImageSharp {
                gatsbyImageData(
                  width: 400
                  height: 400
                  placeholder: BLURRED
                  layout: CONSTRAINED
                )
              }
            }
          }
        }
      }
    }
  }
  footer: allNodeCustomFooter(filter: {fields: {tags: {in: [$id]}}}) {
    edges {
      node {
        drupal_id
        body {
          processed
        }
        relationships {
          field_tags {
            __typename
            ... on TaxonomyInterface {
              drupal_id
              id
              name
            }
          }
          field_footer_logo {
            field_media_image {
              alt
            }
            relationships {
              field_media_image {
                localFile {
                  publicURL
                  childImageSharp {
                    gatsbyImageData(width: 400, placeholder: BLURRED, layout: CONSTRAINED)
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
            ... on paragraph__section {
              drupal_id
              field_section_title
              field_section_classes
              relationships {
                field_section_content {
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
                  ... on paragraph__media_text {
                    field_media_text_title
                    field_media_text_desc {
                      processed
                    }
                    field_media_text_links {
                      title
                      uri
                    }
                    relationships {
                      field_media_text_media {
                        ... on media__image {
                          name
                          field_media_image {
                            alt
                          }
                          relationships {
                            field_media_image {
                              localFile {
                                publicURL
                                childImageSharp {
                                  gatsbyImageData(width: 800, placeholder: BLURRED, layout: CONSTRAINED)
                                }
                              }
                            }
                          }
                        }
                        ... on media__remote_video {
                          drupal_id
                          name
                          field_media_oembed_video
                          relationships {
                            field_media_file {
                              localFile {
                                publicURL
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
            ... on paragraph__media_text {
              field_media_text_title
              field_media_text_desc {
                processed
              }
              field_media_text_links {
                title
                uri
              }
              relationships {
                field_media_text_media {
                  ... on media__image {
                    name
                    field_media_image {
                      alt
                    }
                    relationships {
                      field_media_image {
                        localFile {
                          publicURL
                          childImageSharp {
                            gatsbyImageData(width: 800, placeholder: BLURRED, layout: CONSTRAINED)
                          }
                        }
                      }
                    }
                  }
                  ... on media__remote_video {
                    drupal_id
                    name
                    field_media_oembed_video
                    relationships {
                      field_media_file {
                        localFile {
                          publicURL
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
  }
  images: allMediaImage(filter: {relationships: {node__program: {elemMatch: {relationships: {field_program_acronym: {id: {eq: $id}}}} }}}) {
    edges {
      node {
        drupal_id
        field_media_image {
          alt
        }
        relationships {
          field_media_image {
            localFile {
              publicURL
              childImageSharp {
                 gatsbyImageData(
                  transformOptions: {cropFocus: CENTER}
                  placeholder: BLURRED
                  aspectRatio: 3
                )
              }
              extension
            }
          }
        }
      }
    }
  }
  imagesTagged: allMediaImage(filter: {fields: {tags: {in: [$id]}}}) {
    edges {
      node {
        drupal_id
        field_media_image {
          alt
        }
        relationships {
          field_media_image {
            localFile {
              publicURL
              childImageSharp {
                 gatsbyImageData(
                  transformOptions: {cropFocus: CENTER}
                  placeholder: BLURRED
                  aspectRatio: 3
                )
              }
              extension
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
  videos: allMediaRemoteVideo(
      filter: {relationships: {node__program: {elemMatch: {relationships: {field_program_acronym: {id: {eq: $id}}}}}}}
    ) {
      edges {
        node {
          drupal_id
          field_media_oembed_video
          field_video_width
          field_video_height
          name
          relationships {
            field_media_file {
              localFile {
                publicURL
              }
            }
          }
        }
      }
    }
  news: allNodeArticle(
    limit: 4
    sort: {fields: created}
    filter: {fields: {tags: {in: [$id]}}}
  ) {
    edges {
      node {
        title
        drupal_id
        changed
        created
        fields {
          alias {
            value
          }
        }
        body {
          processed
        }
        relationships {
          field_hero_image {
            field_media_image {
              alt
            }
            relationships {
              field_media_image {
                localFile {
                  url
                  childImageSharp {
                    gatsbyImageData(width: 400, placeholder: BLURRED, layout: CONSTRAINED)
                  }
                }
              }
            }
          }
          field_news_category {
            drupal_id
            id
            name
          }
          field_tags {
            __typename
            ... on TaxonomyInterface {
              drupal_id
              id
              name
            }
          }
        }
      }
    }
  }
  testimonials: allNodeTestimonial(
    sort: {fields: created}
    filter: {fields: {tags: {in: [$id]}}}
  ) {
    edges {
      node {
        changed
        drupal_id
        body {
          processed
        }
        title
        field_testimonial_person_desc
        field_home_profile {
          title
          uri
        }
        relationships {
          field_hero_image {
            field_media_image {
              alt
            }
            relationships {
              field_media_image {
                localFile {
                  url
                  childImageSharp {
                    gatsbyImageData(
                      width: 400
                      height: 400
                      placeholder: BLURRED
                      layout: CONSTRAINED
                    )
                  }
                }
              }
            }
          }
          field_tags {
            __typename
            ... on TaxonomyInterface {
              drupal_id
              id
              name
            }
          }
        }
      }
    }
  }
}
`
