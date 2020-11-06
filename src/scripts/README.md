<h1>Scripts</h1>

<b>All the next commands should be ran via bash terminal since scripts exec shell commands under the hood.</b>


<br />
<h3>bin.js</h3>
<p>
    Bin file that normally executes when you call siegel globally. All the scripts bellow could be called via bin.<br />
    Run this script without parameters to get information about commands and arguments it accepts.
</p>


<br />
<h3>init_project.js</h3>
<p>
    This script creates production ready project with predefined folder structure including already configured siegel.<br />
    Also it adds npm script commands to your package.json that cover mostly all the cases you need during your web development.<br />
    More about these npm scripts you may read in <a href='https://github.com/CyberCookie/siegel/tree/master/demo_app'>demo project section</a>.
</p>


<br />
<h3>createSSL.js</h3>
<p>
    Creates localhost ssl certificate to be used in NodeJS server.<br />
    Also it creates authority certificate for testing purposes to be imported in a web browser.
</p>

<br />
<h3>install_peers.js</h3>
<p>
    Siegel has some peer dependencies to make eslint and typescript work.<br />
    Sad but these dependencies you should resolve manually.<br />
    Using this script it's become easy to install all the necessary peer dependencies.<br/>
    Particular dependency won't be installed if you already have such one with a version higher than the one used in siegel.
</p>


<br />
<h3>update_deps.js</h3>
<p>
    Must be ran at project root level where package.json is.<br/>
    It's the fastest way to update packages, listed in 'dependencies' and 'devDependencies' fields, to the most latest versions.<br />
    <b>Be carefull since force update may break your project.</b>
</p>