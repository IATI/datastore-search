import PO from 'pofile';
import en from '../en/index.js';
import fr from '../fr/index.js';

let po = new PO();
const { Item } = PO;

const en_translation_keys = Object.keys(en.message);
const fr_translation_keys = Object.keys(fr.message);

en_translation_keys.forEach((msgkey) => {
    const msgid = en.message[msgkey];
    let msgstr = '';
    if (fr_translation_keys.includes(msgkey)) {
        msgstr = fr.message[msgkey];
    }
    let po_item = new Item();
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
