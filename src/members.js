import btoa from 'btoa';
const LG = console.log;

const members = {
  createMember: (name, provider, id, email, db, cb) => {

    LG('* * * Creating member %s', name);

    members.getMemberByExternalId(provider, id, db, (err, member) => {
      if ( member ) {
        LG('* * * Does exist, so do NOT member.createMember() :');
        LG(member.id);
        LG(member.provider);
        cb( err, member );
        return;
      }

      LG('* * * None exist, so member.createMember() :');
      const spec = {
        id: btoa(new Date().getTime()).replace(/=/g, ''),
        name: name,
        email: email,
        providers: [
          {
            provider: provider,
            id: id
          }
        ]
      };

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

  getMemberByExternalId: (provider, id, db, cb) => {
    LG('Look for member %s', id);
    db.get( ( error, data ) => {
      let member;
      if ( ! error && data && data.members ) {
        member = data.members.find((mb) =>
          mb.providers.findIndex((p) => p.provider == provider && p.id == id) >= 0);
      }
      LG('Found member %s', member);
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
        // if ( data.members.length < 1 ) {
        //   data.members.push({ id: 0, email: 'a@b.c', name: 'Gooraham', providers: [] });
        //   LG(' Members list has %s', members.list[0].name);
        //   LG( members );
        //   db.set( data, error => {
        //     if ( error ) {
        //       LG('Could not add member list to storage');
        //       throw error;
        //     }
        //     LG('Members placed in storage %s', data.members[0].name);
        //   });
        // }

        next(null);
      } );
    }
  }

};

export default members;
