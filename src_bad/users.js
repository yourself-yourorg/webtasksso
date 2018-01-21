const LG = console.log;

const users = {
  list: [{ id: 0, phone: 987, name: 'Gooraham', providers: [] }],

  createUser: (name, phone, provider, id) => {
    const user = {
        id: list.length,
        name: name,
        phone: phone,
        providers: [
            {
                provider: provider,
                id: id
            }
        ]
    };
    list.push(user);
    return user;
  },

  getUserByExternalId: (provider, id) => list.find((u) =>
        u.providers.findIndex((p) => p.provider == provider && p.id == id) >= 0),

  getUserById: (id) => list.find((u) => u.id == id),

  init : () => {
    return ( req, res, next ) => {
      const db = req.webtaskContext.storage;
      db.get( ( error, data ) => {
        if ( error ) throw error;
        if ( ! data ) throw new Error('No storage has been defined.');
        data.users = data.users || [];
        if ( data.users.length < 1 ) {
          data.users.push({ id: 0, phone: 'none', name: 'dummy', providers: [] });
          LG(' Users list has %s', users.list[0].name);
          LG( users );
          db.set( data, error => {
            if ( error ) {
              LG('Could not add user list to storage');
              throw error;
            }
            LG('Users placed in storage %s', data.users[0].name);
          });
        }

        next(null);
      } );
    }
  }

};

export default users;
