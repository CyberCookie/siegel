<h1>Scripts</h1>

<p>
    There are three scripts which could help you to automate some routines.<br/>
    <b>All the next commands should be ran via bash terminal since scripts exec shell commands under the hood.</b>
</p>


<br />
<h3>init_project.js</h3>

<p>
    Must be ran at project root level where package.json is.<br/>
    This script creates production ready project with predefined folder structure including already configured siegel to provide the best expirience.<br />
    Also it creates npm script commands in your package.json that cover mostly all the cases you will need during development.<br />
    More about these scripts read in <a href='https://github.com/CyberCookie/siegel/tree/master/demo_app'>demo project section</a>.
</p>

<ul>
    <b>The script accepts parameters:</b>
    <li>
        <b>--peers</b> - to install peer dependencies
    </li>
    <li>
        <b>--run</b> - to run a project in development mode right after project was created and peer dependencies was installed<br />
        (if __--peers__ parameter had been passed)
    </li>
</ul>


<br />
<h3>createSSL.js</h3>
Creates localhost ssl certificate to be used in siegel's static server.<br />
Also it ceates authority certificate for testing purposes to be imported in chrome browser or another.


<br />
<h3>install_peers.js</h3>
<p>
    siegel has some peer dependencies to make eslint and typescript work.<br />
    Sad but these dependencies you should resolve manually.<br />
    Using this script it's become easy to install all the necessary peer dependencies.<br/>
    Peer dependency won't be installed if you already have such one with a version higher than used in siegel.
</p>


<br />
<h3>update_deps.js</h3>
<p>
    Must be ran at project root level where package.json is.<br/>
    It's the fastest way to update all your deps to the most latest versions.<br />
    <b>Be carefull since force update of all your dependencies can break your project.</b>
</p>

<br /><hr />
<details>
    <summary><h5>TODO</h5></summary>
    <ul>
        <li>Single command with subcommands</li>
        <li>Move to .bin</li>
        <li>Replace bash commands with node solutions</li>
    </ul>
</details>