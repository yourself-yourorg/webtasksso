import btoa from 'btoa';
const LG = console.log;

const members = {
  createMember: (spec, db, cb) => {

    // LG('* * * Creating member %s', spec.name);

    const prov = spec.providers[0];
    members.getMemberByExternalId(prov.provider, prov.id, db, (err, member) => {
      if ( member ) {
        // LG('* * * Does exist, so do NOT member.createMember() :');
        // LG(member.id);
        // LG(member.provider);
        cb( err, member );
        return;
      }

      // LG('* * * None exist, so member.createMember() :');
      spec['id'] = btoa(new Date().getTime()).replace(/=/g, '');

      db.get( ( error, data ) => {
        if ( ! error && data && data.members ) {
          data.members.push(spec);
          db.set( data, error => {
            if ( error ) {
              LG('Could not add user to storage');
              throw error;
            }
            // LG('New user appended to storage : %s', spec.name);
            cb( error, spec );
          });
        }
      } );
    } );
  },

  getMemberByExternalId: (provider, id, db, cb) => {
    // LG('Look for member %s', id);
    db.get( ( error, data ) => {
      let member;
      if ( ! error && data && data.members ) {
        member = data.members.find((mb) =>
          mb.providers.findIndex((p) => p.provider == provider && p.id == id) >= 0);
      }
      // LG('Found member %s', member);
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
