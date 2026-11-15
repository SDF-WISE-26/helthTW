# Accounts

Anonymous account without registration, see decision 0020. Insecure proof of concept, test data only.

- Opening the app creates an account for the device, without name, email or phone.
- Every request carries the device's account ID. Without a valid ID the backend answers 401.
- The same device always keeps the same account, until its data is deleted.
- "Delete all data" in the settings deletes the account and every record that belongs to it, on the server and on the device.

## Known weaknesses

- The ID is also the password. It is stored in the database and may end up in logs.
- XSS can read `localStorage`.
- Safari deletes `localStorage` after 7 days without use, unless the app is installed on the home screen.
