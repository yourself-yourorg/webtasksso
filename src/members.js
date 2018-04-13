import btoa from 'btoa';
import jwt from 'jsonwebtoken';

const LG = console.log;

const members = {
  createMember: (spec, db, cb) => {
    // LG('* * * Creating member %s', spec.name);

    const prov = spec.providers[0];
    members.getMemberByExternalId(prov.provider, prov.id, db, (err, member) => {
      if ( member ) {
        LG('* * * Does exist, so do NOT member.createMember() :');
        // LG(member.id);
        cb( err, member );
        return;
      }
      LG('* * * None exist, so member.createMember() :');
      spec['id'] = btoa(new Date().getTime()).replace(/=/g, '');

      db.get( ( error, data ) => {
        if ( ! error && data && data.members ) {
          data.members.push(spec);
          db.set( data, error => {
            if ( error ) {
              LG('Could not add user to storage');
              throw error;
            }
            LG('New user appended to storage : %s', spec.name);
            cb( error, spec );
          });
        }
      } );
    } );
  },

  logOutMember: (req, cb) => {
    LG('Log out member');
    // LG(req.webtaskContext.headers.authorization);
    const tkn = req.webtaskContext.headers.authorization.split(/[ ,]+/)[1];
    // LG(tkn);
    LG(jwt.decode(tkn).id);
    const id = jwt.decode(req.webtaskContext.headers.authorization.split(/[ ,]+/)[1]).id;
    // LG(req.params);
    // LG('...........................');
    LG(` ${req.params.memb}  vs  ${id}`);
    if ( req.params.memb === id ) LG('PROCEED WITH LOG OUT');

    const db = req.webtaskContext.storage;
    db.get( ( error, data ) => {
      let member;
      if ( ! error && data && data.members ) {
        let pos = data.members.findIndex(mb => mb.id == id);
        LG(`Found ${id} at pos ${pos}`);
        delete data.members[pos].providers[0];
        db.set( data, error => {
          if ( error ) {
            LG('Could not update user in storage');
            throw error;
          }
          // LG('New user appended to storage : %s', spec.name);
          // cb( error, id );
        });
      }
      cb( error, member );
    } );

    // req.webtaskContext.storage.set({ members: [] }, { force: [] },
    //   function (error) {
    //     if (error) return cb(error);
    //     // LG('Purged members');
    // });
  },

  findProviderUser: (soughtId, soughtProvider, callback, aProvider) => {
    // LG('aProvider');
    // LG(`${soughtProvider} vs ${aProvider.provider}`);
    // LG(soughtProvider === aProvider.provider);
    // LG('soughtId');
    // LG(`${soughtId} vs ${aProvider.id}`);
    // LG(soughtId === aProvider.id);
    return (soughtProvider === aProvider.provider) && (soughtId === aProvider.id);
  },

  testMember: (soughtId, soughtProvider, callback, aMember ) => {

    // LG(`Testing member :: ${aMember.name} => ${aMember.providers[0].provider} ${aMember.providers[0].id}.  Want ${soughtId}  `);
    if (aMember.providers.find(members.findProviderUser.bind(null, soughtId, soughtProvider, callback))) {
      // LG(' * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * Found * * * ');
      return aMember;
    }
    return false;
  },

  getMemberByExternalId: (provider, id, db, cb) => {
    // LG('Look for member %s >>>>>>>>>>>>>.', id);
    db.get( ( error, data ) => {
      let member;
      if ( ! error && data && data.members ) {
        member = data.members.find(members.testMember.bind(null, id, provider, cb));
      }
      if (member) {
        LG(`${member.id} -- ${member.email}`);
      } else {
        LG(`No Google member :: ${id}`);
      };
      cb( error, member );
    } );
  },

  getMemberByEmail: (provider, id, db, cb) => {
    db.get( ( error, data ) => {
      let member;
      if ( ! error && data && data.members ) {
        member = data.members.find((mb) => mb.email == email);
      }
      cb( error, member );
    } );
  },

  getMemberById: (provider, id, db, cb) => {
    db.get( ( error, data ) => {
      let member;
      if ( ! error && data && data.members ) {
        member = data.members.find((mb) => mb.id == id);
      }
      cb( error, member );
    } );
  },

  purgeAllMembers: (req, cb) => {
    // LG('Purging members');
    req.webtaskContext.storage.set({ members: [] }, { force: [] },
      function (error) {
        if (error) return cb(error);
        // LG('Purged members');
    });
  },

  init : () => {
    return ( req, res, next ) => {
      const db = req.webtaskContext.storage;
      db.get( ( error, data ) => {
        if ( error ) throw error;
        if ( ! data ) throw new Error('No storage has been defined.');
        data.members = data.members || [];

        next(null);
      } );
    }
  }

};

export default members;
