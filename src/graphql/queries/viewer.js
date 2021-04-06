const { gql } = require('graphql-request');

module.exports = gql`
  query ResponseCodes($zoneId: String!, $start: Date!, $end: Date!) {
    viewer {
      zones(filter: { zoneTag: $zoneId }) {
        httpRequests1dGroups(
          filter: {
            date_geq: $start,
            date_leq: $end
          },
          limit: 31,
          orderBy: [date_DESC]
        ) {
          dimensions {
            date
          }
          sum {
            responseStatusMap {
              edgeResponseStatus
              requests
            }
          }
        }
      }
    }
  }
`;
