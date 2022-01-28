import global from '../global.js'

export default async function sitemap({ next, to }) {
  console.log(to.name);

  await global.createSitemaps();

  return next();
}