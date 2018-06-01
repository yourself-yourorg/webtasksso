import btoa from 'btoa';
import jwt from 'jsonwebtoken';

import { getPerson } from './api/person';

const LG = console.log;

const tmpAuth = {
  'dude.awap@gmail.com': ['visitor', 'member'],
  'water.iridium.blue@gmail.com': ['visitor', 'member', 'distributor', 'staff', 'manager', 'owner', 'legalRepresentative'],
  'doowa.diddee@gmail.com': ['visitor', 'member', 'distributor', 'staff'],
};



const members = {
  getMemberPrivileges: (_req, _cb) => {
    let req = _req;
    req.params.module = 'person';
    LG(
      `getMemberPrivileges: `);
    LG( req.params );
    const result = getPerson(req, _cb);
    return result
  },

  createMember: (spec, ctx, cb) => {
    // LG('* * * Creating member %s', spec.name);
    const { db, secrets } = ctx;

    const prov = spec.providers[0];
    members.getMemberByExternalId(prov.provider, prov.id, db, (err, member) => {
      if ( member ) {
        LG('* * * Does exist, so refresh user privileges :');
        LG(member.id);
        LG(member.email);
        const req = {
          params: {
            module: 'person',
            email: member.email
          },
          webtaskContext: { secrets },
        };
        members.getMemberPrivileges( req, (err, res) => {
          LG(`
            getMemberPrivileges   callback !!!!!!!!!!`);

          if (res.permissions) {
            LG(res.permissions);

            db.get( ( error, data ) => {
              if ( ! error && data && data.members ) {
                let D = data;
                let M = D.members;
                LG(`
                  data.members.id: <${member.id}> <${member.permissions}>`);
                LG(data.members);
                let memb = 0;
                while ((memb < M.length) && (M[memb].id != member.id) ) {
                  LG(`
                    data.members.id: <${M[memb].id}> vs <${member.id}>`);
                  memb += 1;
                }
                LG(`
                  Found M[${memb}].id: <${M[memb].id}> <${M[memb].permissions}>`);
                M[memb].permissions = res.permissions;
                LG(`
                  Found M[${memb}].id: <${M[memb].id}> <${D.members[memb].permissions}>`);
                db.set( D, error => {
                  if ( error ) {
                    LG('Could not alter user privileges in storage');
                    throw error;
                  }
                  LG('Altered user privileges in storage : %s', data.members[memb].name);
                  cb( error, D );
                });
              }
            });
          }
        });
        cb( err, member );
        return;
      }
      LG(`* * * None exist, so member.createMember() : '${spec.email}'`);
      spec['id'] = btoa(new Date().getTime()).replace(/=/g, '');
      spec['permissions'] = "{ 'Example': 2, 'Person': 0 }";


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
