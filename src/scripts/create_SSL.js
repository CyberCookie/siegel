const { writeFileSync, unlinkSync } = require('fs')
const join = require('path').join;
const shell = require('child_process').execSync;


function main() {
    const cwd = process.cwd()
    
    
    const filenames = {
        domains: 'domains.ext',
        rootCAKey: 'RootCA.key',
        rootCAPem: 'RootCA.pem',
        rootCACrt: 'RootCA.crt',
        localhostKey: 'localhost.key',
        localhostCsr: 'localhost.csr',
        localhostCrt: 'localhost.crt'
    }
    
    const domainsContent = [
        'authorityKeyIdentifier=keyid,issuer',
        'basicConstraints=CA:FALSE',
        'keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment',
        'subjectAltName = @alt_names',
        '[alt_names]',
        'DNS.1 = localhost'
    ].join('\n')
    
    const domainsPath = join(cwd, filenames.domains)
    const rootCAPemPath = join(cwd, filenames.rootCAPem)
    
    const days = '-days 1024'
    const rsa = '-newkey rsa:2048'
    
    
    
    writeFileSync(domainsPath, domainsContent)
    
    shell(`openssl req -x509 -nodes -new -sha256 ${days} ${rsa} -keyout ${filenames.rootCAKey} -out ${filenames.rootCAPem} -subj "/C=US/CN=Example-Root-CA"`)
    shell(`openssl x509 -outform pem -in ${filenames.rootCAPem} -out ${filenames.rootCACrt}`)
    shell(`openssl req -new -nodes ${rsa} -keyout ${filenames.localhostKey} -out ${filenames.localhostCsr} -subj "/C=US/ST=YourState/L=YourCity/O=Example-Certificates/CN=localhost.local"`)
    shell(`openssl x509 -req -sha256 ${days} -in ${filenames.localhostCsr} -CA ${filenames.rootCAPem} -CAkey ${filenames.rootCAKey} -CAcreateserial -extfile ${filenames.domains} -out ${filenames.localhostCrt}`)
    
    
    unlinkSync(domainsPath)
    unlinkSync(join(cwd, filenames.localhostCsr))
    unlinkSync(join(cwd, filenames.rootCAKey))
    unlinkSync(rootCAPemPath)
    unlinkSync(rootCAPemPath.replace('pem', 'srl'))
    
    
    
    
    console.log(`
Add ${filenames.localhostCrt} and ${filenames.localhostKey} to your server config.
Import ${filenames.rootCACrt} into the chrome browser SSL settings -> Authorities.
    `)
}


module.parent
    ?   (module.exports = main)
    :   main()