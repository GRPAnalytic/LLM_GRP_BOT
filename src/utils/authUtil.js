const ADMIN_REQUIRED = [
    'table.add',
    'table.delete',
    'table.add.save',
    'table.delete.save',
];

const isActionAllowed = (action, user) => {
    if (!ADMIN_REQUIRED.includes(action)) return true;
    return ADMIN_REQUIRED.includes(action) && user?.is_admin;
}

module.exports = {
    isActionAllowed,
}