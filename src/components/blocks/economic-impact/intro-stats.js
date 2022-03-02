import React from "react"
import { StaticQuery, graphql } from "gatsby"
import { Container, Col } from "react-bootstrap";
import Statistic from 'components/shared/statistic';

const colourOptions = [
  {border: "var(--black)"},
  {border: "var(--uog-red)"},
  {border: "var(--uog-yellow)"},
  {border: "var(--uog-blue)"},
  {border: "var(--black)"},
];

const render = ({ title, stats }) => (
    <>
    <Container>
      <h3 className="visually-hidden">{title}</h3>
      <Statistic className="row row-cols-sm-2 mb-5 g-5">
        {stats.map(({value, type}, index) => 
          <Col key={`intro-stat-${index}`} className="col-lg">
            <Statistic.BorderCard border={colourOptions[index].border} >
              <Statistic.Value><strong>{value}</strong></Statistic.Value>
              <Statistic.Type>{type}</Statistic.Type>
            </Statistic.BorderCard>
          </Col>
        )}
        </Statistic>
      </Container>
    </>
)

const query = graphql`
  query {
    economicImpactYaml(id: {eq: "economic_impact_intro_stats"}) {
      id
      title
      stats {
          value
          type
      }
    }
  }
`

export default function EconImpactIntroStats () {
  return <StaticQuery query={query} render={({economicImpactYaml}) => render(economicImpactYaml, colourOptions)} />
}