# nordplan
Web app for rating festival artists and creating a schedule

# usage
A group of friends can use this app to direct their preparation prior to attending a festival. the app will track individual artist ratings when they sign in. the app is meant to be used while the group listens to the artists from the official program. users can rate artists using a five star scale. users can then use this data to create and view their own custom schedule by adding or removing artists. the group can see shared statistics to determine overlaps in what they like. 

# technical
google login
firestore database
vercel hosting 
sveltekit app
skeleton ui and tailwindcss
mobile first and primary

# setup

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Create a Firebase project**
   - Go to [Firebase Console](https://console.firebase.google.com/) and create a new project
   - Enable **Authentication → Google** sign-in provider
   - Enable **Firestore Database** (start in production mode)
   - Add a web app to get your config values

3. **Add Firestore security rules**
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /ratings/{userId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null && request.auth.uid == userId;
       }
       match /schedules/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your Firebase config values in `.env`.

5. **Run locally**
   ```bash
   npm run dev
   ```

6. **Deploy to Vercel**
   - Push to GitHub and connect the repo in [Vercel](https://vercel.com/)
   - Add the environment variables from `.env` in the Vercel project settings
   - Vercel will auto-deploy on push
