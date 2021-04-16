# Design

## Description of changes to the exisiting Covey.Town codebase

### Frontend

#### New Components

    Following components were added in the frontend  folder - frontend\src\components:

    a) Home\Home.tsx
    b) ChatBox\ChatWindow.tsx

    The Home.tsx was developed to create a home page with description of the application to let the user understand the scope of it. It has Sign In and Sign Up buttons to let the users create an account and log in to the application using the credentials. This covers parts of the first and second user story as explained in the FEATURE.md.

    The ChatWindow.tsx was developed to let the users text chat with other users in the town. The ChatWindow has an option to either send public message to all the users of the town or a private message to a single user. This covers third and fourth user story as explained in the FEATURE.md

#### Changes to existing components

    Following existing components were edited in the frontend folder - frontend\src\components:

    a) CoveyTypes.ts
    b) App.tsx
    c) Login\Login.tsx
    d) Login\TownSelection.tsx
    e) classes\TownServiceClient.ts

    The CoveyAppState in the CoveyTypes.ts was modified to include emailId of the user as a part of the state.

    The App.tsx contains the logic of rendering pages based on different condition. Two new CoveyAppUpdate was included - playerLoggedIn and playerLoggedOut to handle the login and logout feature. AppStateReducer was modified to include the CoveyAppUpdate. SessionStorage was added to handle the states on page refresh LoginHandler and LogoutHandler was added to render different pages on login and logout. UseMemo was modified to incorporate home page and changes were made to the conditions to render the pages.

    The Login.tsx was modified to add a menu dropdown which has three functionalites - Profile, Meeting History and Logout which are the remaining parts of the first and second user stories as explained in the FEATURE.md

    The TownSelection.tsx was modified for format changes.

    The TownServiceClient.ts was modified to include services like - loginUser(), logoutUser(), registerUser(), fetchLogs(), updateProfile(), deleteProfile() for the first and second user stories as explained in the FEATURE.md

### Services

#### New Components

    Following components were added in the services folder - services\roomService:

#### Changes to existing components

    Following existing components were edited in the services folder - services\roomService:

## Architecture of the new code

![Architecture](./Architecture.JPG)

## CRC Diagram

![image](https://user-images.githubusercontent.com/69494422/114808196-ccf0ce00-9d75-11eb-9369-0620fcaac8b7.png)

![image](https://user-images.githubusercontent.com/69494422/114808289-f1e54100-9d75-11eb-8d6d-fe51a6dfe6be.png)

![image](https://user-images.githubusercontent.com/69494422/114808305-f9a4e580-9d75-11eb-8dd6-241c5093d100.png)

![image](https://user-images.githubusercontent.com/69494422/114808327-032e4d80-9d76-11eb-8751-909b801043b2.png)

![image](https://user-images.githubusercontent.com/69494422/114808342-09242e80-9d76-11eb-9973-ba53161bda8c.png)

![image](https://user-images.githubusercontent.com/69494422/114808353-0e817900-9d76-11eb-90d7-19e05c09115d.png)
