const PO = require('pofile');
const en = require('esm')(module)('../en/index');
const fr = require('esm')(module)('../fr/index');

let po = new PO();

const en_translation_keys = Object.keys(en.default.message);
const fr_translation_keys = Object.keys(fr.default.message);

en_translation_keys.forEach((msgkey) => {
    const msgid = en.default.message[msgkey];
    let msgstr = '';
    if (fr_translation_keys.includes(msgkey)) {
        msgstr = fr.default.message[msgkey];
    }
    let po_item = new PO.Item();
    po_item.msgid = msgid;
    po_item.msgstr = msgstr;
    po_item.comments = [msgkey];
    po.items.push(po_item);
});

po.save('locale/po/datastore_search.po', function (err) {
    if (err) {
        console.log(err);
    }
});
