# Node.js PostgreSQL 

Data Models
Users
Id, name, email, loginId

Processes
processId, creatorId, participantId, canViewComment, signedOff, comment, picture (s3 link)

Can defnitely normalize this table based on additional context and requirement, currently it will result in lots of joins

APIs
Pagination can be added to the APIS, and authentication as well. For now limited the scope

Event driven implementation - 
Ideally this needs to be an event drive microservice based architecture where any change event like process creation is published to 
a kafka topic and a microservice will listen to that, this way it will occur async and decrease the latency. 

Microservices 
Notiication service - based on the type of event it will send the email/ web notiication
  send Email - 
    Listens to process_created event and sends an email to all the participants 
    Listens to the all_sign_off event and sends an email to all the participants
  web notification service -
    Microservice that listens to the sign_off event and sends a notification to the the creator [given the connection has to be alive not a good design - connection will be idle most of the time]

## Project setup
```
npm install
```

### Run
```
node server.js
```
