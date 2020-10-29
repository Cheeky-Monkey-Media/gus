import { useStaticQuery, graphql } from "gatsby"

export const useMenuData = () => {
  const data = useStaticQuery(
    graphql`
      query {
        allMenuItems {
		  edges {
			node {
			  id
			  menu_name
			  title
			  url
			  childMenuItems {
				title
				url
				route {
				  parameters {
					node
				  }
				}
			  }
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
		}
      }
    `
  )
  return data.allMenuItems.edges;
}