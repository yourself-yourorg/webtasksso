export default {
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
};

