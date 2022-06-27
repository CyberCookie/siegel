const parseJWT = (token: string) => (
    JSON.parse( atob( token.split('.')[1] || '' ) || '{}' )
)


export default parseJWT