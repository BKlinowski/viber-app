import { db } from '../server.js';

export const getMessages = (req, res, next) => {
  let messages = [];
  let contacts = [];
  let events = [];
  db.serialize(async () => {
    db.all(
      `SELECT EventID, Type, Status, Body, ThumbnailPath
                 FROM Messages`,
      (err, data) => {
        if (err) {
          console.error(err.message);
        }
        messages = data;
        db.all(
          `SELECT Name, Number, ClientName, ContactID FROM Contact`,
          (err, data) => {
            if (err) {
              console.error(err.message);
            }
            contacts = data;
            db.all(
              `SELECT EventID, ContactID, TimeStamp FROM Events  ORDER BY EventID ASC`,
              (err, data) => {
                if (err) {
                  console.error(err.message);
                }

                events = data;
                let contactsArr = [];
                for (let i = 0; i < events.length; i++) {
                  contactsArr.push(
                    Object.assign(
                      {},
                      contacts.find((el) => el.ContactID == events[i].ContactID)
                    )
                  );
                  contactsArr[i].timestamp = events[i].TimeStamp;
                  contactsArr[i].eventID = events[i].EventID;
                }
                let count = 1;
                for (let i = 0; i < messages.length; i++) {
                  let imgPath = null;
                  if (messages[i]['ThumbnailPath']) {
                    imgPath = messages[i]['ThumbnailPath'].split('/');
                    imgPath = imgPath[imgPath.length - 1];
                    messages[i]['ThumbnailPath'] = imgPath;
                  }
                  if (
                    messages[i].Type == 1 ||
                    messages[i].Type == 2 ||
                    messages[i].Type == 9 ||
                    messages[i].Type == 11 ||
                    messages[i].Type == 72
                  ) {
                    messages[i].count = count;
                    count++;
                  }
                  messages[i]['Contact'] = Object.assign(
                    {},
                    contactsArr.find((el) => {
                      return messages[i].EventID == el.eventID;
                    })
                  );
                  messages[i].timestamp = new Date(
                    messages[i].Contact.timestamp
                  );
                  messages[i]['Contact'] = {
                    name: messages[i]['Contact'].Name
                      ? messages[i]['Contact'].Name
                      : messages[i]['Contact'].ClientName,
                    number: messages[i]['Contact'].Number,
                  };
                }
                return res.render('tables/messages', {
                  rows: messages,
                });
              }
            );
          }
        );
      }
    );
  });
};
export const getCalls = (req, res, next) => {
  let calls = [];
  let contacts = [];
  let events = [];
  db.serialize(async () => {
    db.all(
      `SELECT EventID, Type, Status, Duration
                 FROM Calls`,
      (err, data) => {
        if (err) {
          console.error(err.message);
        }
        calls = data;
        db.all(
          `SELECT Name, Number, ClientName, ContactID FROM Contact`,
          (err, data) => {
            if (err) {
              console.error(err.message);
            }
            contacts = data;
            db.all(
              `SELECT EventID, ContactID, TimeStamp FROM Events  ORDER BY EventID ASC`,
              (err, data) => {
                if (err) {
                  console.error(err.message);
                }
                events = data;
                let contactsArr = [];
                for (let i = 0; i < events.length; i++) {
                  contactsArr.push(
                    Object.assign(
                      {},
                      contacts.find((el) => el.ContactID == events[i].ContactID)
                    )
                  );
                  contactsArr[i].eventID = events[i].EventID;
                }
                for (let i = 0; i < calls.length; i++) {
                  calls[i]['Contact'] = Object.assign(
                    {},
                    contactsArr.find((el) => {
                      return calls[i].EventID == el.eventID;
                    })
                  );
                  calls[i]['Contact'] = {
                    name: calls[i]['Contact'].Name
                      ? calls[i]['Contact'].Name
                      : calls[i]['Contact'].ClientName,
                    number: calls[i]['Contact'].Number,
                  };
                }
                return res.render('tables/calls', {
                  rows: calls,
                });
              }
            );
          }
        );
      }
    );
  });
};

export const getContacts = (req, res, next) => {
  db.serialize(async () => {
    db.all(
      `SELECT Name, Number, MID, ClientName, ContactFlags, Timestamp
                 FROM Contact`,
      (err, data) => {
        if (err) {
          console.error(err.message);
        }
        return res.render('tables/contacts', {
          rows: data,
        });
      }
    );
  });
};
