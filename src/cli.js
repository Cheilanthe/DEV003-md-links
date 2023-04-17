#!/usr/bin/env node

import chalk from 'chalk';
import { mdLinks, linksBroken, linksOk, uniqueLinks } from './index.js';

const blue = chalk.hex('#0A9396');
const orange = chalk.hex('#CA6702');
const pink = chalk.hex('9B2226');
const green = chalk.hex('90be6d');
function processFunction(args) {
  // console.log(args);
  const path = process.argv.slice(2);
  const pathString = path[0];
  const options = process.argv;
  // console.log(options);
  if (path.length === 0) {
    console.log(blue('WELCOME! This library validate the URL. Please enter a path'));
    console.log(blue('if you need help use the following commands:', pink.bold('-help'), 'or', pink.bold('-h')));
  } else if (pathString.includes('-help') || pathString.includes('-h')) {
    console.log(blue('To use this library you must write an absolute or a relative path'));
    console.log(orange('Example with path abs:'), pink('md-links'), blue('C:/Users/Users/Laboratoria/proyectos/social-network/README.md'));
    console.log(orange('Example with path relative:'), pink('md-links'), blue('./DEV003-social-network/README.md '));
    console.log(blue('Also you can use the options', pink('--validate'), ' for request the http status, and', pink('--stast'), 'to count valid, unique or broken links.'));
  } else if (options.includes('--validate') && options.includes('--stats')) {
    mdLinks(pathString, { validate: true })
      .then((linksHTTP) => {
        console.log(blue('Total:', green(linksHTTP.length), 'Links ok:', green(linksOk(linksHTTP)), 'Links broken:', green(linksBroken(linksHTTP))));
      });
  } else if (options.includes('--validate')) {
    mdLinks(pathString, { validate: true })
      .then((linksHTTP) => {
        linksHTTP.forEach((link) => {
          console.log(blue('path:', green(link.pathText), 'link:', green(link.href), 'status', green(link.Status, link.ok), 'host:', green(link.host)));
        });
      })
      .catch((error) => console.log(pink(error.message)));
  } else if (options.includes('--stats')) {
    mdLinks(pathString, { validate: false })
      .then((links) => {
        console.log(blue('Total:', green(links.length), 'Links uniques: ', green(uniqueLinks(links))));
      });
  } else if (!options.includes('--validate')) {
    mdLinks(pathString, { validate: false })
      .then((links) => {
        links.forEach((link) => {
          console.log(blue('path:', green(link.pathText), 'link:', green(link.href), 'host:', green(link.host)));
        });
      })
      .catch((error) => console.log(pink(error.message)));
  } else {
    console.log(pink('Exist a problem with the commands, check it'));
  }
}
processFunction(process.argv);
