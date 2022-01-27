const { createWriteStream } = require('fs');
const axios = require('axios');
const { resolve } = require('path');
const {
  SitemapAndIndexStream,
  SitemapStream} = require('sitemap');
const { Readable } = require('stream');

const sms = new SitemapAndIndexStream({
  limit: 50000,
  getSitemapStream: (i) => {
    const sitemapStream = new SitemapStream({ hostname: 'https://dev-ds-search.iatistandard.org/' });
    const path = `sitemap-${i}.xml`;

    const ws = sitemapStream
      .pipe(createWriteStream(resolve('./public/' + path))); // write it to sitemap-NUMBER.xml

    return [new URL(path, 'https://dev-ds-search.iatistandard.org/').toString(), sitemapStream, ws];
  },
});

const baseUrlSitemap = "https://dev-api.iatistandard.org/dss/activity/select?q=*:*&facet=true&facet.field=iati_identifier&facet.sort=index&facet.limit=-1";
const axiosConfig = {
  headers: {
    'Ocp-Apim-Subscription-Key': 'fbaac107c5754bd1a5d67448bc52ce47',
  }
};

axios.get(baseUrlSitemap, axiosConfig).then((result) => {
  const readableStream = Readable.from(
    result
    .data
    .facet_counts
    .facet_fields
    .iati_identifier
    .filter((d, i) => i % 2 === 0)
    .map((d) => "/activity/" + d)
  );
  readableStream
    .pipe(sms)
    .pipe(createWriteStream(resolve('./public/sitemap-index.xml')));
})
