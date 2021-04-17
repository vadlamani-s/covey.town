# Features

## User Stories and steps to interact with it

### 1. As a user, I need to register myself with the application to access a secured application service

    a) Once the application is launched, click the 'Sign Up' button to register yourself to the application.
    b) Fill in the Full name, email address and password to create an account. Reenter your password to
    confirm your original password.
    c) Sign in to the application as explained in user story 2, click on the menu dropdown which is on top middle.
    d) Click on profile to view your profile details.
    e) The account can be edited for its username or deleted. Password is mandatory to edit or delete the profile.

### 2. As a user, I need to login to the application so that I can access the history of my meetings

    a) Once the application is launched, click the 'Sign In' button to login to the application.
    b) Enter the email address and password which you used to register to the application.
    c) Once logged in, click on the menu dropdown on the left and select the Meeting History to view
    the details of the meeting attended through this account.
    d) From the menu dropdown, click on the logout option to quit the application.

### 3. As a user I need to be able to send or receive messages to/from all other users in the meeting

    a) Login to the application as explained in user story
    b) Create a new town or join an existing town to interact with other users.
    c) Select the chat from the bottom menu bar.
    d) Click on public radio button, and type your message in the space provided and click on send.
    e) The messages will be sent to all the other users in the town.
    f) If other users sends the message, you will receive it in the chat box.

### 4. As a user I need to be able to send or receive messages to/from a user in the meeting

    a) Login to the application as explained in user story
    b) Create a new town or join an existing town to interact with other users.
    c) Select the chat from the bottom menu bar.
    d) Click on private radio button, choose the user from the town to whom you want to send private
    message, type your message in the space provided and click on send.
    e) The messages will be sent to the particular user in the town.
    f) If the users replies back, it can be seen in the chat box.
  
# Testing

## Automated test details

    CoveyAuthREST.test.ts -> Tests all the REST APIs related to authorization - Epic 1.
    CoveyTownController.test.ts -> Added test cases for authorization - Epic 1.
    CoveyTownsSocket.test.ts -> Added test cases for chat features - Epic 2.
    
    Modified TestUtils.ts to handle socket connections for Chat feature. 
    Added DummyDB.ts to imitate a real DB instead of actually connecting to the Mongo DB. This is used by the test cases to run without having to connect to the actual MongoDB.
    To achieve this, we mocked DBMethods class in coveyDBMethods.ts which will access the mock implementations instead of the real database implementations.
    
    Mocked the API validation across all test modules to run the test cases without failing as API validation is a new feature that was introduced into the application.
    
