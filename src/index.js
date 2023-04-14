import { evaluatePath,
  isPathTrue,
  filextname,
  readFileUser,
  getLinks,
  validateLinks,
  joinArrays,
// eslint-disable-next-line import/extensions
} from './functions.js';

export const mdLinks = (path, option) => new Promise((resolve, reject) => {
  if (isPathTrue(path)) {
    evaluatePath(path);
    if (filextname(path) === '.md') { // leer los archivos de la ruta, buscar MD
      readFileUser(path) // Leer el contenido del MD
        .then((data) => {
          const links = getLinks(data, path);
          if (option.validate) { // ejecutar la extracción de links deacuerdo a options
            const linksHTTP = validateLinks(links)
              .then((linksHTTP) => {
                const finalResult = joinArrays(links, linksHTTP);
                // console.log(finalResult);
                return finalResult;
              });
            resolve(linksHTTP);
          } else {
            // console.log(links);
            resolve(links);
          }
        })
        .catch((error) => {
          reject(new Error('No hay links para validar', error));
        });
    } else {
      reject(new Error('El archivo no tiene terminación .md'));
    }
  } else {
    reject(new Error('El path no es válido'));
  }
});
export const linksOk = (array) => {
  const okLinks = array.filter((link) => link.ok === 'ok');
  return okLinks.length;
};
export const linksBroken = (array) => {
  const brokenLinks = array.filter((link) => link.ok === 'fail');
  return brokenLinks.length;
};
export const uniqueLinks = (array) => {
  const uniques = [];
  array.forEach((link) => {
    if (!uniques.includes(link.href)) {
      uniques.push(link.href);
    }
  });
  return uniques.length;
};
// -------------Pruebas -------------------------}
const pathCompleted = 'C:/Users/D_Elizabeth/Laboratoria/proyecto4/DEV003-md-links/PRUEBA1.md';
// const pathRelative ='./PRUEBA1.md';
// const errorPath ='./PRUEBA.md';
const fileName1 = './PRUEBA2.md';
// const pruebaReal = 'C:/Users/D_Elizabeth/Laboratoria/proyecto3/DEV003-social-network/README.md'

// mdLinks(pathCompleted, { validate: true })
//   .then((links) => {
//     console.log('ok:', linksOk(links), 'broken:', linksBroken(links), 'uniques: ', uniqueLinks(links));
//   })
//   .catch((error) => (error));
// mdLinks(fileName1)
//   .then((links) => links)
//   .catch((error) => console.log(error.message));
