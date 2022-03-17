import React from 'react';
import { graphql } from 'gatsby';

const WidgetBlock = ({data}) => {

    return <div class='widgetBlock'>
        <p> this is the widget block data</p>
        </div>

}
export default WidgetBlock

export const WidgetBlockQuery = graphql`
  fragment WidgetBlockQuery on block_content__widget_block 
  {
   
   
          relationships {
            field_block_widget {
              drupal_id
              paragraph_type {
                drupal_internal__target_id
              }
            }
          }
        
      
    
  }
  `