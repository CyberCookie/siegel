const parseJWT = (token: string) => (
    JSON.parse( window.atob( token.split('.')[1] || '' ) || '{}' )
)


export default parseJWT