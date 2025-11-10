/**
 * Parses tocken string and extract a data from it
 *
 * @param token - JSON web token string
 * @returns parsed JSON web token
 */
const parseJWT = (token: string) => (
    JSON.parse( atob( token.split('.')[1] || '' ) || '{}' )
)


export default parseJWT