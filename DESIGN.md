# Design

## Description of changes to the exisiting Covey.Town codebase

### Frontend

#### New Components

    Following components were added in the frontend  folder - frontend\src\components:

    a) Home\Home.tsx
    b) ChatBox\ChatWindow.tsx

    The Home.tsx was developed to create a home page with description of the application to let the user understand
    the scope of it. It has Sign In and Sign Up buttons to let the users create an account and log in to the
    application using the credentials. This covers parts of the first and second user story as explained in the FEATURE.md.

    The ChatWindow.tsx was developed to let the users text chat with other users in the town. The ChatWindow has an
    option to either send public message to all the users of the town or a private message to a single user. This covers
    third and fourth user story as explained in the FEATURE.md

#### Changes to existing components

    Following existing components were edited in the frontend folder - frontend\src\components:

    a) CoveyTypes.ts
    b) App.tsx
    c) Login\Login.tsx
    d) Login\TownSelection.tsx
    e) classes\TownServiceClient.ts

    The CoveyAppState in the CoveyTypes.ts was modified to include emailId of the user as a part of the state.

    The App.tsx contains the logic of rendering pages based on different condition. Two new CoveyAppUpdate was included -
    playerLoggedIn and playerLoggedOut to handle the login and logout feature. AppStateReducer was modified to include the
    CoveyAppUpdate. SessionStorage was added to handle the states on page refresh LoginHandler and LogoutHandler was added
    to render different pages on login and logout. UseMemo was modified to incorporate home page and changes were made to
    the conditions to render the pages.

    The Login.tsx was modified to add a menu dropdown which has three functionalites - Profile, Meeting History and Logout
    which are the remaining parts of the first and second user stories as explained in the FEATURE.md

    The TownSelection.tsx was modified for format changes.

    The TownServiceClient.ts was modified to include services like - loginUser(), logoutUser(), registerUser(), fetchLogs(),
    updateProfile(), deleteProfile() for the first and second user stories as explained in the FEATURE.md

### Services

#### New Components

    Following components were added in the services folder - services\roomService:
    a) db/coveyDBMethods.ts
    b) requestHandlers/userAuthRequestHandlers
    c) models/historySchema.ts
    d) models/userSchema.ts
    e) router/auth.ts
    f) types/User.ts
    g) types/Validate.ts
    h) types/IUser.ts
    
    The coveyDBMethods contains all the logic to deal with CRUD operation on the database which in our project is MongoDB.
    The methods are also responsible for user authorization operations and meeting history storage operations.
    
    The UserAuthRequestHandlers contains handlers for dealing with the API's responsible for user authorization, user detail
    storage and history of all the meeting logs for each user. 
    
    The History Schema defines a schema for storing the meeting history of  the users joining Covey Towns. The schema contains
    all the required fields for storing the details in the History table in the Moongo database.
    
    The User Schema defines a schema for storing the user details joining Covey Towns. The schema contains all the required fields
    for storing the details in the User table in the Moongo database.
    
    The Auth file contains the router functions which are responsible for routing all the User Authorization operations.
    
    The User class contains all the requires details of the User who creates an account in the Covey application. It encapsulates
    all the fields required to be stored in the databse as well as the getter methods.
    
    The Validate class is reponsible for validating the frontend requests before accessing any backend or database services based
    on the logic of Signing and verofication of the cookies.
    
    The IUser is an interface which is implemented by the User class and defines user operations.
    

#### Changes to existing components

    Following existing components were edited in the services folder - services\roomService:
    a) requestHandlers/CoveyTownRequestHandlers.ts
    b) coveyTownListeners.ts
    c) coveyTownController.ts
    d) router/towns.ts
    e) types/payloads.ts
    
    The coveyTownRequestHandlers had to be modifed with addition listeners for incorporating the public and private chat which is part
    of the user story. The sockets.on methods are additionally created for sending public and private chat between the users in the room.
    
    The coveyTownListeners interface were made changes to add two additional listners for incorporating private and public chat facility.
    
    The coveyTOwnController was updated to include logic for the private and public chat facilities. To achieve this a HashMap was added
    to hold the listners for the corresponding players.
    
    The Towns was updated with an API for fetching all the history details of a player. The details include the information about the rooms
    joined as well as the join dates.
    
    The Payload has 2 additional interfaces namely the RoomLogin which is the interface for keeping track of the history details of the
    player and LogListResponse interface for fetching room joined details for a player.
    
    
## Architecture of the new code

<img src="./Architecture.JPG" width="1000">

## CRC Diagram

<img src="https://user-images.githubusercontent.com/69494422/114979535-064e3a00-9e59-11eb-98d4-8f7c63f7b7ad.png" width="500">
<img src="https://user-images.githubusercontent.com/69494422/114979557-11a16580-9e59-11eb-8d31-111d3d6a0c96.png" width="500">
