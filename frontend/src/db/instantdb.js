import { init, id } from '@instantdb/react';

const APP_ID = '3ec1b259-9d1c-465a-87ab-4d5cac75763a';

// InstantDB 0.22 doesn't require schema definition in init
// Schema is managed in InstantDB dashboard
const db = init({ appId: APP_ID });

// Export id function for generating IDs
export { id };
export default db;
