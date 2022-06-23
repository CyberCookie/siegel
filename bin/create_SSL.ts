'use strict'

import fs from 'fs'
import { execSync as shell } from 'child_process'

import isRunDirectly from '../core/utils/is_run_directly.js'
import { PATHS } from '../core/constants.js'


function main() {
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

    const domainsPath = `${PATHS.cwd}/${filenames.domains}`
    const rootCAPemPath = `${PATHS.cwd}/${filenames.rootCAPem}`
    const localhostCSRPath = `${PATHS.cwd}/${filenames.localhostCsr}`
    const rootCAKeyPath = `${PATHS.cwd}/${filenames.rootCAKey}`

    const days = '-days 1024'
    const rsa = '-newkey rsa:2048'



    fs.writeFileSync(domainsPath, domainsContent)

    shell(`openssl req -x509 -nodes -new -sha256 ${days} ${rsa} -keyout ${filenames.rootCAKey} -out ${filenames.rootCAPem} -subj "/C=US/CN=Example-Root-CA"`)
    shell(`openssl x509 -outform pem -in ${filenames.rootCAPem} -out ${filenames.rootCACrt}`)
    shell(`openssl req -new -nodes ${rsa} -keyout ${filenames.localhostKey} -out ${filenames.localhostCsr} -subj "/C=US/ST=YourState/L=YourCity/O=Example-Certificates/CN=localhost.local"`)
    shell(`openssl x509 -req -sha256 ${days} -in ${filenames.localhostCsr} -CA ${filenames.rootCAPem} -CAkey ${filenames.rootCAKey} -CAcreateserial -extfile ${filenames.domains} -out ${filenames.localhostCrt}`)


    fs.unlinkSync(domainsPath)
    fs.unlinkSync(localhostCSRPath)
    fs.unlinkSync(rootCAKeyPath)
    fs.unlinkSync(rootCAPemPath)
    fs.unlinkSync(rootCAPemPath.replace('pem', 'srl'))




    console.log(`
Add ${filenames.localhostCrt} and ${filenames.localhostKey} to your server config.
Import ${filenames.rootCACrt} into the chrome browser SSL settings -> Authorities.
    `)
}

isRunDirectly(import.meta) && main()


export default main