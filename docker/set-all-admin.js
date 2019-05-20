db = db.getSiblingDB('calories');
db.users.update({}, { $set: { permissions: ["users_edit", "meals_all"] } }, { multi: true });
