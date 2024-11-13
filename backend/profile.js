import BPromise from "bluebird";
import YAML from "yamljs";

export const getProfile = (superlogin, user_id) => {
  const userDB = superlogin.userDB;
  const profile = {};
  return userDB.get(user_id).then(function (userDoc) {
    profile._id = userDoc._id;
    profile.name = userDoc.name;
    profile.email = userDoc.email;
    profile.providers = userDoc.providers;
    userDoc.providers.forEach(function (provider) {
      if (provider !== "local") {
        const info = YAML.stringify(userDoc[provider].profile._json);
        profile[provider] = info;
      }
    });
    // Make a list
    const providerConfig = superlogin.config.getItem("providers");
    const allProviders = [];
    if (providerConfig) {
      Object.keys(providerConfig).forEach(function (key) {
        allProviders.push(key);
      });
    }
    profile.allProviders = allProviders;
    profile.sessions = 0;
    if (userDoc.session) {
      profile.sessions = Object.keys(userDoc.session).length;
    }
    return BPromise.resolve(profile);
  });
};

export const changeProfileName = (superlogin, user_id, newName) => {
  const userDB = superlogin.userDB;
  return userDB.get(user_id).then(function (userDoc) {
    userDoc.name = newName;
    return userDB.put(userDoc);
  });
};
