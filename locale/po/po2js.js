import PO from 'pofile';

let fr = { default: { message: {} } };

PO.load('locale/po/datastore_search.po', function (err, po) {
    if (err) {
        console.log(err);
    }
    po.items.forEach((item) => {
        const msgkey = item.comments[0];
        const msgstr = item.msgstr[0];
        fr.default.message[msgkey] = msgstr;
    });
    process.stdout.write('export default ');
    console.log(JSON.stringify(fr.default, null, 4));
});
